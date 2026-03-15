// ONE-TIME MIGRATION: Supabase Storage → Cloudflare R2
// Run locally with `npm run dev` to avoid Vercel's 60s timeout
// Call: POST /api/r2-migrate?offset=0&limit=20
// Header: x-revalidate-secret: <REVALIDATE_SECRET>
// Repeat with increasing offset until done === total
// DELETE THIS FILE after migration is complete

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

const TABLES = [
  { table: 'government_orders', urlCol: 'pdf_url',   bucket: 'documents' },
  { table: 'audio_classes',     urlCol: 'audio_url', bucket: 'audio' },
  { table: 'articles',          urlCol: 'image_url', bucket: 'article-images' },
];

function isSupabaseUrl(url) {
  return typeof url === 'string' && url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

// Extract storage path from Supabase public URL
// Format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
function extractStoragePath(url, bucket) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function POST(req) {
  // Protect with revalidate secret
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '20');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const r2 = getR2Client();

  const results = { total: 0, done: 0, failed: [], nextOffset: offset + limit };

  for (const { table, urlCol, bucket } of TABLES) {
    // Fetch rows with file URLs, paginated
    const { data: rows, error } = await supabase
      .from(table)
      .select(`id, ${urlCol}`)
      .not(urlCol, 'is', null)
      .range(offset, offset + limit - 1);

    if (error || !rows) continue;

    // Only process rows that still point to Supabase Storage
    const toMigrate = rows.filter(r => isSupabaseUrl(r[urlCol]));
    results.total += toMigrate.length;

    for (const row of toMigrate) {
      const oldUrl = row[urlCol];

      // Extract storage path from the old Supabase URL
      const storagePath = extractStoragePath(oldUrl, bucket);
      if (!storagePath) {
        results.failed.push({ id: row.id, table, url: oldUrl, error: 'Could not parse storage path' });
        continue;
      }

      try {
        // Generate signed download URL via Supabase service role (handles private buckets)
        const { data: signedData, error: signErr } = await supabase.storage
          .from(bucket)
          .createSignedUrl(storagePath, 3600);
        if (signErr) throw new Error('Sign URL failed: ' + signErr.message);

        // Download the file
        const fileRes = await fetch(signedData.signedUrl);
        if (!fileRes.ok) throw new Error(`Download failed: ${fileRes.status}`);
        const buffer = await fileRes.arrayBuffer();
        const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';

        // Upload to R2 keeping the same filename
        const filename = storagePath.includes('/') ? storagePath.split('/').pop() : storagePath;
        const r2Key = `${bucket}/${filename}`;
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: r2Key,
          Body: Buffer.from(buffer),
          ContentType: contentType,
        }));

        // Update DB row with new R2 public URL
        const newUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
        const { error: updateErr } = await supabase
          .from(table)
          .update({ [urlCol]: newUrl })
          .eq('id', row.id);
        if (updateErr) throw new Error('DB update failed: ' + updateErr.message);

        results.done++;
      } catch (err) {
        results.failed.push({ id: row.id, table, url: oldUrl, error: err.message });
      }
    }
  }

  return Response.json(results);
}

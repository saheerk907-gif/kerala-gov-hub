import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true, // REQUIRED: R2 does not support virtual-hosted-style URLs
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function POST(req) {
  // Check R2 env vars are configured
  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_BUCKET_NAME ||
    !process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  ) {
    return Response.json({ error: 'Storage not configured, contact admin' }, { status: 500 });
  }

  // Validate admin JWT using Supabase service role client
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return Response.json({ error: 'Session expired, please log in again' }, { status: 401 });
  }

  // Parse and validate body
  let key, contentType;
  try {
    ({ key, contentType } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!key || !contentType) {
    return Response.json({ error: 'Missing key or contentType' }, { status: 400 });
  }

  // Generate presigned PUT URL (5 min TTL)
  // ContentType is signed into the URL — browser PUT must use the exact same value
  try {
    const r2 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
    return Response.json({ presignedUrl, publicUrl });
  } catch (err) {
    return Response.json({ error: 'Failed to generate upload URL: ' + err.message }, { status: 500 });
  }
}

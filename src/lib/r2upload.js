// Client-side utility: upload a file to Cloudflare R2 via presigned URL
// Returns: { publicUrl: string }
// Throws:  Error with user-readable message

function sanitizeFilename(name) {
  const lastDot = name.lastIndexOf('.');
  const ext = lastDot !== -1 ? name.slice(lastDot) : '';
  const base = lastDot !== -1 ? name.slice(0, lastDot) : name;
  const clean = base
    .replace(/[^\x00-\x7F]/g, '')      // strip non-ASCII (Malayalam etc.)
    .replace(/\s+/g, '_')              // spaces → underscores
    .replace(/[^a-zA-Z0-9._-]/g, '_') // other special chars → underscores
    .replace(/_+/g, '_')              // collapse multiple underscores
    .replace(/^_|_$/g, '')            // trim leading/trailing underscores
    || 'file';                         // fallback if entirely non-ASCII
  return clean + ext;
}

export async function r2upload(file, folder) {
  const sanitized = sanitizeFilename(file.name);
  const key = `${folder}/${Date.now()}_${sanitized}`;
  const contentType = file.type || 'application/octet-stream';

  // Get presigned URL from server
  const token = sessionStorage.getItem('admin_token');
  const presignRes = await fetch('/api/r2-presign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ key, contentType }),
  });

  if (presignRes.status === 401) {
    throw new Error('Session expired, please log in again');
  }
  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(err.error || 'Storage not configured, contact admin');
  }

  const { presignedUrl, publicUrl } = await presignRes.json();

  // Upload directly from browser to R2
  // Content-Type MUST match exactly what was signed into the presigned URL
  async function attemptUpload() {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status})`);
    }
  }

  try {
    await attemptUpload();
  } catch {
    // Retry once — presigned URL is still valid within 5 min TTL
    await attemptUpload();
  }

  return { publicUrl };
}

# Cloudflare R2 Integration — Design Spec
**Date:** 2026-03-15
**Project:** Kerala Gov Employee Hub (`keralaemployees.in`)
**Status:** Draft

---

## Problem

Supabase Free Plan has a 5 GB/month cached egress limit. The site is at 120% (5.988 GB), causing throttling. Actual storage is only 72 MB — the problem is repeated file downloads (PDFs, audio, images) being served directly from Supabase Storage with no CDN caching. Cloudflare R2 has zero egress fees.

---

## Goal

Replace Supabase Storage with Cloudflare R2 for all file uploads and serve files via R2's public URL. Migrate all existing files from Supabase Storage to R2 and update database URLs.

---

## Scope

**In scope:**
- New API route: presigned PUT URL generation for R2
- New shared utility: client-side upload function
- Modified admin pages: orders, audio, articles
- One-time migration endpoint (run locally with `next dev`)
- Environment variable additions
- Step-by-step Cloudflare R2 setup guide

**Out of scope:**
- Changing the Supabase database schema (only file URL values change)
- Authentication system changes
- Any frontend UI changes beyond the upload flow

---

## Architecture

```
Admin Browser
    │
    ├─ 1. POST /api/r2-presign  ──►  Next.js API Route
    │         {filename, contentType, folder}   (validates admin JWT, signs request)
    │                                                  │
    │  ◄── { presignedUrl, publicUrl } ────────────────┘
    │
    ├─ 2. PUT {presignedUrl}  ──►  Cloudflare R2 (direct browser → R2, no server)
    │         Headers: { Content-Type: <same value signed into presignedUrl> }
    │
    └─ 3. Save publicUrl  ──►  Supabase DB (unchanged from today)

Migration (one-time, run locally via `next dev` to avoid Vercel timeouts):
POST /api/r2-migrate?offset=0&limit=20
    │
    ├── Read DB rows with old Supabase Storage URLs (paginated)
    ├── For each: generate signed download URL via Supabase service role client
    ├── Fetch file → upload to R2 → update DB row URL
    └── Return { total, done, failed[], nextOffset }
```

---

## Files Changed

### New Files
| File | Purpose |
|------|---------|
| `src/lib/r2upload.js` | Shared client upload function used by all admin pages |
| `src/app/api/r2-presign/route.js` | Server: validates JWT, returns presigned PUT URL |
| `src/app/api/r2-migrate/route.js` | Server: paginated one-time migration from Supabase → R2 |

### Modified Files
| File | Change |
|------|--------|
| `src/app/admin/orders/page.js` | Replace Supabase upload with `r2upload(file, 'documents')` |
| `src/app/admin/audio/page.js` | Replace Supabase upload with `r2upload(file, 'audio')` |
| `src/app/admin/articles/page.js` | Replace Supabase upload with `r2upload(file, 'articles')` |
| `.env.local` | Add 5 R2 environment variables |
| `package.json` | Add `@aws-sdk/client-s3@3.750.0`, `@aws-sdk/s3-request-presigner@3.750.0` |

---

## AWS SDK Configuration for R2

Cloudflare R2 is S3-compatible but requires two non-default settings:

```js
import { S3Client } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,   // REQUIRED: R2 does not support virtual-hosted-style URLs
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
```

**`forcePathStyle: true` is mandatory.** Without it, the SDK generates URLs in the format `bucket.account.r2.cloudflarestorage.com`, which R2 rejects with a silent 403.

---

## Upload Flow (Detailed)

```
1. User selects file in admin panel
2. Client validates file before any network call:
   - orders:   accept application/pdf, max 50 MB
   - audio:    accept audio/*, max 200 MB
   - articles: accept image/*, max 10 MB
3. Sanitize filename: strip non-ASCII, replace spaces with underscores, keep extension
   e.g. "my file (1).pdf" → "my_file_1_.pdf"
   Final key: `{folder}/{Date.now()}_{sanitizedName}`
4. r2upload(file, folder) called:
   a. Determine exact MIME type from `file.type` (e.g. "application/pdf")
   b. POST /api/r2-presign { key, contentType }
      - API reads Authorization header: "Bearer <jwt>"
      - API calls createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).auth.getUser(jwt)
      - If getUser() returns error or user is null → respond 401
      - API calls PutObjectCommand({ Bucket, Key: key, ContentType: contentType })
      - presigner signs URL with same ContentType (5 min TTL)
      - API returns { presignedUrl, publicUrl }
   c. Browser PUTs file to presignedUrl
      - Header: Content-Type MUST equal the contentType sent in step (b) — same value,
        signed into the URL. Any mismatch causes a 403 from R2.
   d. On HTTP 200 → r2upload returns { publicUrl: string }
   e. On failure → r2upload retries once (reusing same presignedUrl, valid within TTL)
   f. On second failure → r2upload throws Error with message for UI display
5. Admin page saves publicUrl to Supabase DB
```

### `r2upload` Function Contract

```js
// src/lib/r2upload.js
async function r2upload(file, folder):
  Returns: { publicUrl: string }   on success
  Throws:  Error                   on failure (message is user-readable)
```

`folder` is a hardcoded string constant passed by each admin page:
- `orders/page.js` always passes `'documents'`
- `audio/page.js` always passes `'audio'`
- `articles/page.js` always passes `'articles'`

---

## Error Handling

| Scenario | Handling |
|----------|---------|
| Missing/expired admin JWT | 401 from `/api/r2-presign` → show "Session expired, please log in again" |
| R2 env vars not set | 500 from API → show "Storage not configured, contact admin" |
| File type not allowed | Client rejects before upload → show allowed types message |
| File too large | Client rejects before upload → show size limit message |
| Content-Type mismatch | Caught by R2 403 → surface as generic upload error with retry |
| R2 upload fails (network) | Retry once (same presignedUrl, valid within 5 min TTL) |
| Second failure | Throw Error → admin page shows error message, upload button re-enabled |
| Migration: Supabase fetch fails | Log to `failed[]`, continue — safe to re-run |
| Migration: R2 upload fails | Log to `failed[]`, continue — safe to re-run |

---

## Migration Endpoint

`POST /api/r2-migrate?offset=0&limit=20`
Header: `x-revalidate-secret: {REVALIDATE_SECRET}`

**Run locally** (`next dev`) to avoid Vercel's 60-second serverless timeout. Call repeatedly with increasing `offset` until `done === total`.

### Tables and URL Columns

| Table | URL Column | Primary Key | Detect Old URL By |
|-------|-----------|-------------|-------------------|
| `government_orders` | `pdf_url` | `id` | Contains `NEXT_PUBLIC_SUPABASE_URL` |
| `audio_classes` | `audio_url` | `id` | Contains `NEXT_PUBLIC_SUPABASE_URL` |
| `articles` | `image_url` | `id` | Contains `NEXT_PUBLIC_SUPABASE_URL` |

**Old URL detection:** Compare against `process.env.NEXT_PUBLIC_SUPABASE_URL` (not a hardcoded string), so it works regardless of project subdomain or custom domain.

**Behavior per file:**
1. Extract storage path from old URL: Supabase Storage URLs follow `{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}` — strip everything up to and including `/{bucket}/` to get `path` (e.g. `documents/1234_file.pdf`). Then call `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).storage.from(bucket).createSignedUrl(path, 3600)` — required because Storage buckets may not be fully public
2. `fetch()` the signed URL to get the file buffer
3. Upload to R2 under same folder/filename structure
4. `UPDATE` DB row setting the URL column to the R2 public URL
5. Log result

**Response:** `{ total, done, failed: [{id, table, url, error}], nextOffset }`

**After migration is complete:** Delete or disable `/api/r2-migrate/route.js`. This endpoint bulk-rewrites database URLs and must not remain active permanently.

**Known limitation:** Running two concurrent migration requests could double-process the same rows (race condition). Run sequentially — one request at a time.

---

## Environment Variables

### Add to `.env.local` and Vercel dashboard:
```
R2_ACCOUNT_ID=                    # Cloudflare Account ID (from dashboard right sidebar)
R2_ACCESS_KEY_ID=                 # R2 API Token Access Key ID
R2_SECRET_ACCESS_KEY=             # R2 API Token Secret
R2_BUCKET_NAME=kerala-gov-hub
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

Note: `NEXT_PUBLIC_R2_PUBLIC_URL` is intentionally prefixed with `NEXT_PUBLIC_` — it is a public URL used to construct file links in the browser. It is not a secret.

The SDK endpoint is derived from `R2_ACCOUNT_ID`:
`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

---

## New Dependencies

```json
"@aws-sdk/client-s3": "3.750.0",
"@aws-sdk/s3-request-presigner": "3.750.0"
```

Versions are pinned (not `^`) to avoid unexpected breaking changes across AWS SDK v3 minor releases.

---

## Cloudflare R2 Setup Steps

1. Go to cloudflare.com → Sign up for free account
2. Left sidebar → **R2 Object Storage** → Enable (free tier: 10 GB storage, 0 egress fees)
3. **Create bucket** → Name: `kerala-gov-hub` → Location: Auto
4. Click bucket → **Settings** → **Public Access** → Allow Access → copy the `pub-xxxx.r2.dev` URL
5. **R2 Overview** → **Manage R2 API Tokens** → Create Token
   - Permission: Object Read & Write
   - Scope: Specific bucket → `kerala-gov-hub`
   - Copy: Account ID, Access Key ID, Secret Access Key
6. Add all 5 values to `.env.local` and Vercel environment variables

---

## CORS Configuration (R2 Bucket)

Required for browser-to-R2 direct uploads. Set in R2 bucket → Settings → CORS:

```json
[
  {
    "AllowedOrigins": ["https://keralaemployees.in", "http://localhost:3000"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## Folder Structure in R2

```
kerala-gov-hub/
├── documents/    ← government order PDFs
├── audio/        ← audio class files
└── articles/     ← article cover images
```

Filenames: `{folder}/{timestamp}_{sanitizedOriginalName}`

---

## Security

- Presigned URLs generated server-side only — R2 credentials never reach the browser
- Presigned URLs valid for 5 minutes, scoped to specific object key and content-type
- Admin JWT validated on every `/api/r2-presign` call using Supabase service role client
- Migration endpoint protected by `REVALIDATE_SECRET` and must be deleted after use
- R2 API token scoped to single bucket only
- `NEXT_PUBLIC_R2_PUBLIC_URL` is intentionally public (read-only access URL)

---

## Post-Migration Checklist

- [ ] Verify all 3 tables have R2 URLs (no remaining `supabase.co/storage` URLs)
- [ ] Test file access via new R2 public URLs
- [ ] Delete `/src/app/api/r2-migrate/route.js`
- [ ] Optionally delete old files from Supabase Storage buckets to recover space
  - Note: leave old files in Supabase for 1 week as fallback in case any direct links are cached

---

## Testing Plan

1. Upload a PDF via orders admin → verify R2 URL saved in DB and PDF is accessible
2. Upload audio via audio admin → verify R2 URL saved in DB and playback works
3. Upload image via articles admin → verify R2 URL saved in DB and image loads
4. Run migration endpoint locally → verify `failed[]` is empty, all DB URLs updated
5. Check Supabase egress dashboard after 24h — should drop to near 0

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMAGES_DIR = join(__dirname, '..', 'public', 'images');

const WEBP_QUALITY = 65;
const MAX_WIDTH = 1920;
const EFFORT = 6;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savings(before, after) {
  const pct = (((before - after) / before) * 100).toFixed(1);
  return `${pct}% smaller`;
}

async function compressImages() {
  const files = await readdir(IMAGES_DIR);
  const jpgFiles = files.filter(f => extname(f).toLowerCase() === '.jpg');

  if (jpgFiles.length === 0) {
    console.log('No .jpg files found in', IMAGES_DIR);
    process.exit(0);
  }

  console.log(`Found ${jpgFiles.length} JPG file(s) in ${IMAGES_DIR}\n`);
  console.log(
    'File'.padEnd(30),
    'Before'.padStart(10),
    'After'.padStart(10),
    'Saved'.padStart(12)
  );
  console.log('-'.repeat(64));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of jpgFiles) {
    const inputPath = join(IMAGES_DIR, file);
    const outputName = basename(file, extname(file)) + '.webp';
    const outputPath = join(IMAGES_DIR, outputName);

    const beforeStat = await stat(inputPath);
    const beforeSize = beforeStat.size;

    await sharp(inputPath)
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,   // do not upscale
        fit: 'inside',              // preserve aspect ratio
      })
      .webp({
        quality: WEBP_QUALITY,
        effort: EFFORT,
      })
      .toFile(outputPath);

    const afterStat = await stat(outputPath);
    const afterSize = afterStat.size;

    totalBefore += beforeSize;
    totalAfter += afterSize;

    console.log(
      file.padEnd(30),
      formatBytes(beforeSize).padStart(10),
      formatBytes(afterSize).padStart(10),
      savings(beforeSize, afterSize).padStart(12)
    );
  }

  console.log('-'.repeat(64));
  console.log(
    'TOTAL'.padEnd(30),
    formatBytes(totalBefore).padStart(10),
    formatBytes(totalAfter).padStart(10),
    savings(totalBefore, totalAfter).padStart(12)
  );

  console.log('\nDone. Original .jpg files have NOT been deleted.');
}

compressImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

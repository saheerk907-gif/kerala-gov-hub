const sharp = require('sharp');
const path  = require('path');

const INPUT  = path.join(__dirname, '../public/kerala-secretariat.webp');
const OUTPUT = path.join(__dirname, '../public/kerala-secretariat-opt.webp');

sharp(INPUT)
  .modulate({ brightness: 0.70, saturation: 0.92 })
  .webp({ quality: 75 })
  .toFile(OUTPUT)
  .then(() => console.log('✓ Saved to public/kerala-secretariat-opt.webp'))
  .catch(err => console.error('✗ Failed:', err.message));

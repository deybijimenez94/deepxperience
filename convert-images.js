const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

const imagePaths = glob.sync('+(Iconos|Imagenes)/**/*.{jpg,jpeg,png}');
let convertedCount = 0;

async function convertImages() {
  for (const imagePath of imagePaths) {
    try {
      const newPath = imagePath.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const image = sharp(imagePath);
      await image.toFile(newPath);
      console.log(`Converted ${imagePath} to ${newPath}`);
      convertedCount++;
      await fs.unlink(imagePath); // Delete original file
    } catch (error) {
      console.error(`Error converting ${imagePath}:`, error);
    }
  }

  console.log(`
Conversion complete. ${convertedCount} images converted to WebP.`);
}

convertImages();

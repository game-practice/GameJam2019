const Jimp = require("jimp");
const path = require("path");

/**
 * Takes a filename, finds that image and saves two halves of it to the `assets` directory
 * @param {string} fileName e.g. `slime.jpg`or `money.jpg`
 */
async function splitImage(fileName) {
  const imagePath = path.join(__dirname, "assets", fileName);
  console.log("imagePath", imagePath);

  const left = await Jimp.read(imagePath);
  const right = await Jimp.read(imagePath);

  const w = left.getWidth();
  const h = left.getHeight();

  const leftCropped = left.crop(0, 0, w / 2, h);
  const rightCropped = right.crop(w / 2, 0, w / 2, h);

  const leftPath = path.join(__dirname, "assets", "left.jpg");
  const rightPath = path.join(__dirname, "assets", "right.jpg");

  await leftCropped.writeAsync(leftPath);
  await rightCropped.writeAsync(rightPath);
}

module.exports = splitImage;

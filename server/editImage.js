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

  const basePath = imagePath.split(".")[0];
  const extension = imagePath.split(".")[1];

  const leftPath = `${basePath}left.${extension}`;
  const rightPath = `${basePath}right.${extension}`;

  await leftCropped.writeAsync(leftPath);
  await rightCropped.writeAsync(rightPath);
}

module.exports = splitImage;

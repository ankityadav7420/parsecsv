const sharp = require("sharp");
const axios = require("axios");
const ImageProcessing = require("../models/ImageProcessing");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const verifyImageSize = require("./verifyImageSize");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

async function downloadImage(url) {
  const response = await axios({
    url,
    responseType: "arraybuffer"
  });
  return Buffer.from(response.data, "binary");
}

async function processImages(requestId, products) {
  const outputDir = path.join(__dirname, "..", "output");

  // Create output directory if not exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Directory ${outputDir} created.`);
  }

  const processedProducts = [];

  for (const product of products) {
    const outputImageUrls = [];

    for (const url of product.inputImageUrls) {
      if (!isValidUrl(url)) {
        console.error(`Invalid URL skipped: ${url}`);
        continue;
      }

      try {
        const imageBuffer = await downloadImage(url);
        const outputPath = path.join(outputDir, `${uuidv4()}.jpg`);
        await sharp(imageBuffer).jpeg({ quality: 50 }).toFile(outputPath);

        await verifyImageSize(url, outputPath);
        outputImageUrls.push(outputPath);

        fs.unlink(outputPath, (err) => {
          if (err) {
            console.error(`Error deleting file ${outputPath}:`, err);
          } else {
            console.log(`Local file ${outputPath} deleted successfully.`);
          }
        });
      } catch (error) {
        console.error(`Error processing image ${url}:`, error);
      }
    }

    processedProducts.push({
      ...product,
      outputImageUrls
    });
  }

  await ImageProcessing.updateOne(
    { requestId },
    { status: "Completed", products: processedProducts }
  );
}

module.exports = processImages;

const fs = require("fs");
const axios = require("axios");

async function downloadImageBuffer(url) {
  const response = await axios({
    url,
    responseType: "arraybuffer"
  });
  return Buffer.from(response.data, "binary");
}

async function verifyImageSize(originalUrl, outputPath) {
  const originalImageBuffer = await downloadImageBuffer(originalUrl);
  const originalSize = originalImageBuffer.length;

  const processedSize = fs.statSync(outputPath).size;

  if (processedSize < originalSize) {
    console.log(
      `Image size reduced from ${originalSize} bytes to ${processedSize} bytes.`
    );
  } else {
    console.log(
      `Processed image size (${processedSize} bytes) is not smaller than the original (${originalSize} bytes).`
    );
  }
}

module.exports = verifyImageSize;

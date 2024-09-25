const multer = require("multer");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");
const ImageProcessing = require("../models/ImageProcessing");
const processImages = require("../utils/processImages");
const stream = require("stream");

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadCSV = (req, res) => {
  const results = [];
  const requestId = uuidv4();

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (req.file.mimetype !== "text/csv") {
    return res
      .status(400)
      .json({ error: "Invalid file type. Please upload a CSV file." });
  }

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        const products = results.map((row, index) => {
          let urls = row["Input Image Urls"] || "";
          let cleanedUrls = urls.split(",").map((url) => url.trim());

          return {
            serialNumber: index + 1,
            productName: row["Product Name"],
            inputImageUrls: cleanedUrls
          };
        });

        const processingData = new ImageProcessing({ requestId, products });
        await processingData.save();

        res.json({
          message: "Image processing in progress see status using requestId",
          requestId: requestId
        });

        processImages(requestId, products);
      } catch (error) {
        console.error("Error processing CSV:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
};

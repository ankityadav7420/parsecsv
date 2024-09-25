const mongoose = require("mongoose");

const imageProcessingSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Processing"
  },
  products: [
    {
      serialNumber: Number,
      productName: String,
      inputImageUrls: [String],
      outputImageUrls: [String]
    }
  ]
});

const ImageProcessing = mongoose.model(
  "ImageProcessing",
  imageProcessingSchema
);
module.exports = ImageProcessing;

const ImageProcessing = require("../models/ImageProcessing");
const generateCSV = require("../utils/generateCSV");

exports.getStatus = async (req, res) => {
  const { requestId } = req.params;
  const processingData = await ImageProcessing.findOne({ requestId });

  if (!processingData) {
    return res.status(404).json({ error: "Request ID not found" });
  }

  if (processingData && processingData.status === "Completed") {
    generateCSV(requestId, processingData.products);
  }

  res.json({
    message: "Status fetched successfully",
    status: processingData.status
    // products: processingData.products
  });
};

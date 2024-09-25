const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const formatUrls = (urls) => urls.join(",");

async function generateCSV(requestId, products) {
  const fields = [
    { label: "Serial Number", value: "serialNumber" },
    { label: "Product Name", value: "productName" },
    {
      label: "Input Image Urls",
      value: (row) => formatUrls(row.inputImageUrls)
    },
    {
      label: "Output Image Urls",
      value: (row) => formatUrls(row.outputImageUrls)
    }
  ];

  const outputDir = path.join(__dirname, "..", "output/file");
  const csvFilePath = path.join(outputDir, `${requestId}.csv`);

  // Check if the directory exists, and create it if it doesn't
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(products);

  fs.writeFileSync(csvFilePath, csv);

  console.log(`CSV file created: ${csvFilePath}`);
  return csvFilePath;
}

module.exports = generateCSV;

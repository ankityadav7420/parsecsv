const axios = require("axios");
const ImageProcessing = require("../models/ImageProcessing");

async function triggerWebhook(requestId, webhookUrl) {
  const processingData = await ImageProcessing.findOne({ requestId });

  axios
    .post(webhookUrl, { data: processingData })
    .then(() => console.log("Webhook triggered successfully"))
    .catch((error) => console.error("Error triggering webhook", error.header));
}

module.exports = triggerWebhook;

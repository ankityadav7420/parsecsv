const express = require("express");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const statusRoutes = require("./routes/statusRoutes");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const compression = require("compression");

require("dotenv").config();
const app = express();

connectDB();

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);
app.use(compression());

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

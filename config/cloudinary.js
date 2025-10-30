const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "ecommerce_products",
      resource_type: "auto", // 🔥 auto-detects image, video, pdf, etc.
      public_id: file.originalname.split(".")[0], // optional: keep name before extension
    };
  },
});

// ✅ Multer instance
const upload = multer({ storage });

module.exports = { cloudinary, upload };

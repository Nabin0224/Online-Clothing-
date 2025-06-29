require('dotenv').config();   // load environment variables from .env
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require("sharp");



      // Configuration using .env variables 
      cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET,
        secure: true,
    })

    const storage = new multer.memoryStorage();

    async function handleImageUtils(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type :"auto"
  })
  return result;
    };

    const upload = multer({ storage }).array("images", 5); // "images" should match frontend


    module.exports = { upload, handleImageUtils }
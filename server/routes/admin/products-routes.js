const express = require("express");
const router = express.Router();

const {handleImageUpload} = require("../../controllers/admin/product-controller");

const {
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/product-controller");

const { upload } = require("../../helpers/cloudinary");

router.post("/upload-image", upload, handleImageUpload);

router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
 
module.exports = router;

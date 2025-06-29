const {
  addAddress,
  editAddress,
  deleteAddress,
  fetchAllAddress,
} = require("../../controllers/shop/address-controllers");

const express = require("express");
const router = express.Router();

router.post("/add", addAddress);
router.get("/fetch/:userId", fetchAllAddress);
router.put("/edit/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;

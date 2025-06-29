const { 
    searchProducts,
    searchOrders
} = require("../../controllers/shop/search-controller")

const express = require("express");
const router = express.Router();

router.get("/:keyword", searchProducts);
router.get("/order/:search",searchOrders);

module.exports = router;
const { createCodOrder, getAllOrdersByUser, getOrderDetails } = require("../../controllers/shop/cod-order-controller")

const express = require("express");

const router = express.Router();

router.post("/createCod", createCodOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/order/:id", getOrderDetails);

module.exports = router
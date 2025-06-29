const express = require("express");
const router = express.Router();

const { createEsewaOrder, captureEsewaOrder, verifyEsewaPayment, getAllOrdersByUser, getOrderDetails } = require("../../controllers/shop/esewa-order-controllers");


router.post("/createesewa", createEsewaOrder);
router.post("/captureesewa", captureEsewaOrder);
router.get("/verifyesewa", verifyEsewaPayment)
router.get("/list/:userId", getAllOrdersByUser)
router.get("/order/:id", getOrderDetails)

module.exports = router;
const express = require("express");
const { subscribe } = require("../../controllers/shop/subscribe");
const router = express.Router();

router.post("/getSubscribed", subscribe);

module.exports = router;
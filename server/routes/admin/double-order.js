const express = require("express");
const checkDoubleOrder = require("../../controllers/admin/double-order-check");
const router = express.Router();

router.post("/check-order", checkDoubleOrder);

module.exports = router;
const express = require("express");
const { sendSms } = require("../../controllers/admin/sms-controller");
const router = express.Router();

router.post("/sendSms", sendSms);

module.exports = router;
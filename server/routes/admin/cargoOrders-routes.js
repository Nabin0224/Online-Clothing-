const express = require("express");
const { getAllOrdersFromCargo } = require("../../controllers/admin/cargoOrder-controller");
const router = express.Router();

router.get("/get", getAllOrdersFromCargo)

module.exports = router;
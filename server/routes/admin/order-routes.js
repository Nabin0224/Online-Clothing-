const { getAllOrdersofAllUser, getOrderDetailsForAdmin, updateOrderStatus} = require("../../controllers/admin/order-controller");

const express = require("express");
const router = express.Router();

router.get("/get", getAllOrdersofAllUser);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
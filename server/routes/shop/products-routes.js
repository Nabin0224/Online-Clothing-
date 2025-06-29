
const {getFilterProducts, getProductDetails} = require('../../controllers/shop/products-controllers')
const express = require('express')
const router = express.Router();



router.get('/get', getFilterProducts)
router.get('/get/:id', getProductDetails)

module.exports = router;
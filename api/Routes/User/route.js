const express = require('express')
const router = express.Router()
const bannerController = require('../../Controllers/User/Banner')
const categoryController = require('../../Controllers/User/Category')
const brandController = require('../../Controllers/User/Brand')
const productController = require('../../Controllers/User/Product')


router.get('/banner/index', bannerController.bannerIndex)
router.get('/category/index', categoryController.categoryIndex)
router.get('/category/products', categoryController.categoryWithProducts)

router.get('/brand/index', brandController.brandIndex)

router.get('/products/category/:id', productController.productByCategory)
router.get('/product/:id/show', productController.singleProduct)

module.exports = router
const express = require('express')
const router = express.Router()
const bannerController = require('../../Controllers/User/Banner')
const categoryController = require('../../Controllers/User/Category')
const brandController = require('../../Controllers/User/Brand')


router.get('/banner/index', bannerController.bannerIndex)
router.get('/category/index', categoryController.categoryIndex)
router.get('/category/products', categoryController.categoryWithProducts)

router.get('/brand/index', brandController.brandIndex)

module.exports = router
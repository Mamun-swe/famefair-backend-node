const express = require('express')
const router = express.Router()
const BrandController = require('../../Controllers/Admin/Brand')

router.post('/create', BrandController.createBrand)
router.get('/index', BrandController.getBrand)
router.get('/show/:id', BrandController.showBrand)
router.put('/update/:id', BrandController.updateBrand)
router.put('/update/:id/image', BrandController.updateBrandImage)
router.delete('/delete/:id', BrandController.deleteBrand)

module.exports = router


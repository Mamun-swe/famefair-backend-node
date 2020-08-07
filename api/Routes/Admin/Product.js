const express = require('express')
const router = express.Router()
const productController = require('../../Controllers/Admin/Product')

router.get('/index', productController.index)
router.post('/create', productController.store)
router.get('/show/:id', productController.show)
router.put('/update/:id/info', productController.updateInfo)
router.put('/update/:id/image', productController.updateImage)
router.delete('/delete/:id', productController.deleteProduct)

module.exports = router


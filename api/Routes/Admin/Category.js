const express = require('express')
const router = express.Router()
const CategoryController = require('../../Controllers/Admin/Category')

router.post('/create', CategoryController.createCategory)
router.get('/index', CategoryController.getCategory)
router.get('/show/:id', CategoryController.showCategory)
router.put('/update/:id', CategoryController.updateCategory)
router.put('/update/:id/image', CategoryController.updateCategoryImage)
router.delete('/delete/:id', CategoryController.deleteCategory)

module.exports = router


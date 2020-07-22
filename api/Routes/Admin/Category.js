const express = require('express')
const router = express.Router()
const CategoryController = require('../../Controllers/Admin/Category')

router.post('/create', CategoryController.createCategory)
router.get('/categories', CategoryController.getCategory)
router.get('/show/:id', CategoryController.showCategory)
router.put('/update/:id', CategoryController.updateCategory)

module.exports = router


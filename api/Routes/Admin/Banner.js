const express = require('express')
const router = express.Router()
const BannerController = require('../../Controllers/Admin/Banner')

router.post('/create', BannerController.createBanner)
router.get('/index', BannerController.getBanners)
router.delete('/delete/:id', BannerController.deleteBanner)

module.exports = router


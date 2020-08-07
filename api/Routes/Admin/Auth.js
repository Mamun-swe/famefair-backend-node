const express = require('express')
const router = express.Router()
const AuthController = require('../../Controllers/Admin/Auth')

router.get('/index', AuthController.Index)
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me', AuthController.myProfile)
router.post('/reset', AuthController.passwordReset)
router.post('/logout', AuthController.logout)
router.put('/block/:id', AuthController.blockAccount)


module.exports = router
const express = require('express')
const router = express.Router()
const AuthController = require('../../Controllers/Admin/Auth')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me', AuthController.myProfile)
router.post('/reset', AuthController.passwordReset)
router.post('/logout', AuthController.logout)


module.exports = router
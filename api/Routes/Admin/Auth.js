const express = require('express')
const router = express.Router()
const AuthController = require('../../Controllers/Admin/Auth')

router.get('/index', AuthController.Index)
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me/:id', AuthController.Show)
router.post('/reset', AuthController.passwordReset)
router.post('/logout', AuthController.logout)
router.put('/block/:id', AuthController.blockAccount)
router.put('/update/:id', AuthController.updateAccount)

module.exports = router
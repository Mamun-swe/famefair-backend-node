const express = require('express')
const router = express.Router()
const AuthController = require('../../Controllers/Admin/Auth')


router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/reset', AuthController.passwordReset)
router.put('/logout', AuthController.logout)

router.get('/index', AuthController.Index)
router.get('/me/:id', AuthController.Show)
router.put('/block/:id', AuthController.blockAccount)
router.put('/update/:id', AuthController.updateAccount)

module.exports = router
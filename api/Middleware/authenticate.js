const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Admin = require('../../models/Admin')


const authenticate = async (req, res, next) => {
    const token = await req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'Token not found' })
    }

    try {

        // decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, 'SECRET')

        // find admin using token 
        let user = await Admin.findOne({ $and: [{ email: decode.email }, { access_token: splitToken }] }, { role: 1 }).exec()
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        // check role
        if (user.role === 'super_admin') {
            next()
        } else if (user.role === 'admin') {

            if (req.method === 'GET' | req.method === 'POST' | req.method === 'PUT') {
                return next()
            }
            return res.status(401).json({ message: 'You have no permission for this action' })

        } else if (user.role === 'order_management') {

            if (req.path === '/api/admin/order/*') {
                return next()
            }
            return res.status(401).json({ message: 'You have no permission for this action' })

        } else {
            return res.status(401).json({ message: 'unauthorized request' })
        }

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(410).json({ message: 'Token expired' })
        }
        return res.status(501).json({ message: 'unauthorized request' })
    }
}

module.exports = authenticate
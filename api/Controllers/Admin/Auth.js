const Admin = require('../../../models/Admin')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const register = async (req, res, next) => {
    let { name, email, phoneNumber, password, role } = req.body
    try {
        let existAdmin = await Admin.findOne({ $or: [{ email: email }, { phoneNumber: phoneNumber }] })

        if (existAdmin) {
            return res.status(409).json({
                message: "exist"
            })
        }

        let hashPassword = await bcrypt.hash(password, 10)
        let newAdmin = new Admin({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hashPassword,
            role: role
        })

        const admin = await newAdmin.save()
        if (admin) {
            return res.status(201).json({
                message: true
            })
        }

    } catch (error) {
        if (error.name == 'ValidationError') {
            let message = []
            for (field in error.errors) {
                message.push(error.errors[field].message)
            }

            return res.status(500).json({
                success: false,
                message
            })
        }

        next(error)
    }
}


// Login
const login = async (req, res, next) => {
    let { email, password } = req.body
    try {
        let admin = await Admin.findOne({ email: email }).exec()
        if (admin) {
            const result = await bcrypt.compare(password, admin.password)
            if (result) {
                const token = await jwt.sign({ id: admin._id, name: admin.name, email: admin.email, role: admin.role }, 'SECRET', { expiresIn: '1d' })
                const updateToken = await Admin.findOneAndUpdate({ _id: admin._id }, { $set: { 'access_token': token } }, { new: true }).exec()
                if (updateToken) {
                    return res.status(200).json({
                        message: true,
                        token
                    })
                }
                return res.status(204).json({ message: false })

            }
            return res.status(204).json({ message: false })

        }
        res.status(204).json({ message: false })

    } catch (error) {
        next(error)
    }
}


// Password Reset
const passwordReset = async (req, res, next) => {
    res.send("Password Reset Controller")
}


// Me
const myProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'SECRET')

        let admin = await Admin.findOne({ $and: [{ _id: decode.id }, { email: decode.email }] }, { password: 0, access_token: 0 })
        if (!admin) {
            return res.status(204).json({ message: false })
        }

        res.status(200).json({
            message: true,
            admin
        })

    } catch (error) {
        next(error)
    }
}


// Logout
const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'SECRET')

        let admin = await Admin.findOne({ $and: [{ _id: decode.id }, { email: decode.email }, { role: decode.role }] })
        if (!admin) {
            return res.status(204).json({ message: false })
        }

        const updateToken = await Admin.findByIdAndUpdate({ _id: decode.id }, { $set: { 'access_token': null } })
        if (!updateToken) {
            return res.status(401).json({ message: false })
        }
        res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    register,
    login,
    myProfile,
    passwordReset,
    logout
}
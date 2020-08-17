const express = require("express")
const compression = require('compression')
const cors = require("cors")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const Authenticate = require('./api/Middleware/authenticate')

const app = express()
app.use(compression())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.use('/uploads/category', express.static('uploads/category/'))
app.use('/uploads/brand', express.static('uploads/brand/'))
// app.use('/uploads/banner', Authenticate, express.static('uploads/banner/'))
app.use('/uploads/banner', express.static('uploads/banner/'))
app.use('/uploads/product', express.static('uploads/product/'))

// Admin Main Routes
const adminAuthRoute = require("./api/Routes/Admin/Auth")
const adminCategoryRoute = require("./api/Routes/Admin/Category")
const adminBrandRoute = require("./api/Routes/Admin/Brand")
const adminBannerRoute = require("./api/Routes/Admin/Banner")
const adminProductRoute = require("./api/Routes/Admin/Product")

// User Main Routes
const userRoute = require('./api/Routes/User/route')

// Admin API URL's
app.use("/api/admin/auth", adminAuthRoute)
app.use("/api/admin/category", Authenticate, adminCategoryRoute)
app.use("/api/admin/brand", Authenticate, adminBrandRoute)
app.use("/api/admin/banner", Authenticate, adminBannerRoute)
app.use("/api/admin/product", Authenticate, adminProductRoute)

// User API URL's
app.use("/api/user", userRoute)

app.use((req, res, next) => {
    let error = new Error('404 page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        return res.status(404).json({
            message: error.message
        })
    }
    if (error.status == 400) {
        return res.status(400).json({
            message: "Bad request"
        })
    }
    if (error.status == 401) {
        return res.status(401).json({
            message: "You have no permission"
        })
    }
    return res.status(500).json({
        message: "Internal Server Error"
    })
})


app.get('/', (req, res) => {
    res.send("Hello I am node.js application")
})

// DB Connection here
const URL = "mongodb://localhost:27017/famefair"
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: false,
    useFindAndModify: false
}).then(() => console.log("Database connected"));

// App Port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`App running on ${port} port`)
})

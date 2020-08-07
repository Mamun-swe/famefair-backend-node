const Product = require('../../../models/Product')
const Category = require('../../../models/Category')
const Brand = require('../../../models/Brand')
const URL = require('../../../url')

const increment = () => {
    let time = new Date()
    let unique = 'FF' + time.getDate() + time.getMinutes() + time.getMilliseconds()
    return unique
}


// Products Index
const index = async (req, res, next) => {
    let category = req.query.category || ""
    try {

        // find without category
        if (!category) {
            const products = await Product.find()
                .populate('brand')
                .populate('category')
                .sort({ _id: 1 })
            if (!products || products.length <= 0) {
                return res.status(204).json('No products')
            }
            const response = {
                results: products.map(product => {
                    return {
                        id: product._id,
                        code: product.product_code,
                        brand: product.brand.name,
                        category: product.category.name,
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                        image: URL + "uploads/product/" + product.image
                    };
                })
            }
            res.status(200).json(response);

            res.status(200).json(products);
        }


        // find with category
        const products = await Product.find({ category })
            .populate('brand')
            .populate('category')
            .sort({ _id: 1 })
            .exec()

        if (!products || products.length <= 0) {
            return res.status(204).json('No products')
        }
        const response = {
            results: products.map(product => {
                return {
                    id: product._id,
                    code: product.product_code,
                    brand: product.brand.name,
                    category: product.category.name,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    image: URL + "uploads/product/" + product.image
                };
            })
        }
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}


// Store Product
const store = async (req, res, next) => {
    let { name, price, quantity, brand_id, category_id, description } = req.body

    try {

        let product = await Product.findOne({ name })

        if (product) {
            return res.status(409).json({ message: 'exist' })
        }

        let file = req.files.product_image
        const product_image = Date.now() + '.' + file.name
        upoadPath = './uploads/product/' + Date.now() + '.' + file.name

        const moveFile = file.mv(upoadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const newProduct = new Product({
            product_code: increment(),
            brand: brand_id,
            category: category_id,
            name: name,
            price: price,
            quantity: quantity,
            description: description,
            image: product_image
        })

        await Category.findOneAndUpdate(
            { _id: category_id },
            { $push: { products: newProduct._id } },
            { new: true }
        ).exec()

        await Brand.findOneAndUpdate(
            { _id: brand_id },
            { $push: { products: newProduct._id } },
            { new: true }
        ).exec()

        const saveProduct = await newProduct.save()
        if (!saveProduct) {
            return res.status(501).json({ message: false })
        }
        res.status(201).json({ message: true })

    } catch (error) {
        next(error)
    }
}


// Show specific product
const show = async (req, res, next) => {
    let { id } = req.params

    try {
        const product = await Product.findById({ _id: id })
            .populate('brand')
            .populate('category')
            .exec()
        if (!product) {
            return res.status(204).json('No Product available')
        }
        res.status(200).json({
            id: product._id,
            code: product.product_code,
            brand: product.brand.name,
            category: product.category.name,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            image: URL + "uploads/product/" + product.image
        })

    } catch (error) {
        next(error)
    }
}

// update product info
const updateInfo = async (req, res, next) => {
    let { id } = req.params
    let updateData = req.body

    try {
        let product = await Product.findOne({ _id: id }).exec()
        if (!product) {
            return res.status(204).json({ message: 'Product not found' })
        }

        const updateProduct = await Product.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        ).exec()

        if (!updateProduct) {
            return res.status(401).json({ message: 'Failed to update' })
        }
        return res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


// update image
const updateImage = async (req, res, next) => {
    let { id } = req.params

    try {
        let product = await Product.findOne({ _id: id }).exec()
        if (!product) {
            return res.status(204).json({ message: 'Product not found' })
        }

        let file = req.files.product_image
        if (!file) {
            return res.status(204).json({ message: 'Select image first' })
        }
        const product_image = Date.now() + '.' + file.name
        productUploadPath = './uploads/product/' + Date.now() + '.' + file.name
        const moveFile = file.mv(productUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const updateProductImg = await Product.findOneAndUpdate(
            { _id: id },
            { $set: { 'image': product_image } },
            { new: true }
        ).exec()

        if (!updateProductImg) {
            return res.status(401).json({ message: 'Failed to update' })
        }
        return res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


// delete product
const deleteProduct = async (req, res, next) => {
    let { id } = req.params

    try {
        let product = await Product.findOneAndDelete({ _id: id }).exec()
        if (!product) {
            return res.status(204).json({ message: false })
        }
        res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    index,
    store,
    show,
    updateInfo,
    updateImage,
    deleteProduct
}
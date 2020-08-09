const Product = require('../../../models/Product')
const checkId = require('../../Middleware/mongooseId')
const URL = require('../../../url')

// fetch product using category
const productByCategory = async (req, res, next) => {
    let { id } = req.params
    try {
        await checkId(id)
        const products = await Product.find({ category: id }).exec()
        if (!products) {
            return res.status(204).json({ message: 'Product no available' })
        }
        const response = {
            results: products.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: URL + "uploads/product/" + product.image
                };
            })
        }
        res.status(200).json(response);

    } catch (error) {
        next(error)
    }
}


// Single Product
const singleProduct = async (req, res, next) => {
    let { id } = req.params

    try {
        await checkId(id)
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




module.exports = {
    productByCategory,
    singleProduct
}
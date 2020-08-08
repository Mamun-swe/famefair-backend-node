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




module.exports = {
    productByCategory
}
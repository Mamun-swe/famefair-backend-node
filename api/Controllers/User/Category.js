const Category = require('../../../models/Category')
const URL = require('../../../url')

// Category Index
const categoryIndex = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ _id: 1 }).exec()
        if (categories.length <= 0) {
            return res.status(204).json({ message: 'Category null' })
        }

        const response = {
            results: categories.map(category => {
                return {
                    id: category.id,
                    name: category.name,
                    image: URL + "uploads/category/" + category.image
                };
            })
        }
        res.status(200).json(response);

    } catch (error) {
        next(error)
    }
}


// Category with prduct
const categoryWithProducts = async (req, res, next) => {
    try {
        const categories = await Category.find().populate('products').sort({ _id: 1 }).exec()
        if (categories.length <= 0) {
            return res.status(204).json({ message: 'Category null' })
        }

        const response = {
            results: categories.map(category => {
                return {
                    category_id: category.id,
                    category_name: category.name,
                    products: category.products.map(product => {
                        return {
                            product_id: product._id,
                            product_name: product.name,
                            price: product.price,
                            image: URL + "uploads/product/" + product.image
                        }
                    })
                };
            })
        }
        res.status(200).json(response);

    } catch (error) {
        next(error)
    }
}



module.exports = {
    categoryIndex,
    categoryWithProducts
}
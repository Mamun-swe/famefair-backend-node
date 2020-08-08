const Brand = require('../../../models/Brand')
const URL = require('../../../url')

// Brand Index
const brandIndex = async (req, res, next) => {
    try {
        const brands = await Brand.find().sort({ _id: 1 })
        if (brands.length <= 0) {
            return res.status(204).json({ message: 'Brand null' })
        }

        const response = {
            results: brands.map(brand => {
                return {
                    id: brand.id,
                    name: brand.name,
                    image: URL + "uploads/brand/" + brand.image
                };
            })
        }
        res.status(200).json(response);

    } catch (error) {
        next(error)
    }
}


module.exports = {
    brandIndex
}
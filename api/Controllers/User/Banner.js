const Banner = require('../../../models/Banner')
const URL = require('../../../url')

// Banner List
const bannerIndex = async (req, res, next) => {
    try {
        const banners = await Banner.find().sort({ _id: -1 }).exec()
        if (banners.length <= 0) {
            return res.status(204).json({ message: 'Banner null' })
        }

        const response = {
            results: banners.map(banner => {
                return {
                    id: banner._id,
                    image: URL + "uploads/banner/" + banner.image
                };
            })
        }
        res.status(200).json(response);

    } catch (error) {
        next(error)
    }
}


module.exports = {
    bannerIndex
}

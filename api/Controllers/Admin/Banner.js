const Banner = require('../../../models/Banner')
const URL = require('../../../url')

// Create Banner
const createBanner = async (req, res, next) => {
    try {
        let file = req.files.banner_image
        const banner_image = Date.now() + '.' + file.name
        bannerUploadPath = './uploads/banner/' + Date.now() + '.' + file.name

        const moveFile = file.mv(bannerUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const newBanner = new Banner({
            image: banner_image
        })

        const saveBanner = await newBanner.save()
        if (!saveBanner) {
            return res.status(501).json({ message: false })
        }
        res.status(201).json({ message: true })
    } catch (error) {
        next(error)
    }
}


// get Banner's
const getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find().sort({ _id: 1 })

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


// delete banner
const deleteBanner = async (req, res, next) => {
    let { id } = req.params

    try {
        let banner = await Banner.findOneAndDelete({ _id: id }).exec()
        if (!banner) {
            return res.status(204).json({ message: false })
        }
        res.status(200).json({ message: true })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createBanner,
    getBanners,
    deleteBanner
}
const Brand = require('../../../models/Brand')
const URL = require('../../../url')

// create new brand
const createBrand = async (req, res, next) => {
    let { name } = req.body

    try {
        let brand = await Brand.findOne({ name })

        if (brand) {
            return res.status(409).json({ message: 'exist' })
        }

        let file = req.files.brand_image
        const brand_image = Date.now() + '.' + file.name
        brandImageUploadPath = './uploads/brand/' + Date.now() + '.' + file.name

        const moveFile = file.mv(brandImageUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const newBrand = new Brand({
            name: name,
            image: brand_image
        })

        const saveBrand = await newBrand.save()
        if (!saveBrand) {
            return res.status(501).json({ message: false })
        }
        res.status(201).json({ message: true })


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

// fetch all brand
const getBrand = async (req, res, next) => {
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

// fetch single brand
const showBrand = async (req, res, next) => {
    let { id } = req.params

    try {
        const brand = await Brand.findById({ _id: id })
        if (!brand) {
            return res.status(204).json({ message: 'Brand not found' })
        }
        res.status(200).json({
            id: brand._id,
            name: brand.name,
            image: URL + "uploads/brand/" + brand.image
        })

    } catch (error) {
        next(error)
    }
}

// Update brand name
const updateBrand = async (req, res, next) => {
    let { id } = req.params
    let updateData = req.body

    try {
        let brand = await Brand.findOne({ _id: id }).exec()
        if (!brand) {
            return res.status(204).json({ message: 'Brand not found' })
        }

        let brandByName = await Brand.findOne({ name: req.body.name }).exec()
        if (!brandByName) {
            const updateBrnd = await Brand.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { new: true }
            ).exec()

            if (!updateBrnd) {
                return res.status(401).json({ message: 'Failed to update' })
            }
            return res.status(200).json({ message: true })
        }
        res.status(409).json({ message: 'Brand name already exist' })
    } catch (error) {
        next(error)
    }

}


// update brand image
const updateBrandImage = async (req, res, next) => {
    let { id } = req.params

    try {
        let brand = await Brand.findOne({ _id: id }).exec()
        if (!brand) {
            return res.status(204).json({ message: 'brand not found' })
        }

        let file = req.files.brand_image
        if (!file) {
            return res.status(204).json({ message: 'Select image first' })
        }
        const brand_image = Date.now() + '.' + file.name
        brandImageUploadPath = './uploads/brand/' + Date.now() + '.' + file.name
        const moveFile = file.mv(brandImageUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const updateBrandImg = await Brand.findOneAndUpdate(
            { _id: id },
            { $set: { 'image': brand_image } },
            { new: true }
        ).exec()

        if (!updateBrandImg) {
            return res.status(401).json({ message: 'Failed to update' })
        }
        return res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


// delete brand
const deleteBrand = async (req, res, next) => {
    let { id } = req.params

    try {
        let brand = await Brand.findOneAndDelete({ _id: id }).exec()
        if (!brand) {
            return res.status(204).json({ message: false })
        }
        res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }

}


module.exports = {
    createBrand,
    getBrand,
    showBrand,
    updateBrand,
    updateBrandImage,
    deleteBrand
}
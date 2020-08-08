const Category = require('../../../models/Category')
const URL = require('../../../url')

// create new category
const createCategory = async (req, res, next) => {
    let { name } = req.body

    try {
        let category = await Category.findOne({ name })

        if (category) {
            return res.status(409).json({ message: 'exist' })
        }

        let file = req.files.cat_image
        const cat_image = Date.now() + '.' + file.name
        catImageUploadPath = './uploads/category/' + Date.now() + '.' + file.name

        const moveFile = file.mv(catImageUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const newCategory = new Category({
            name: name,
            image: cat_image
        })

        const saveCategory = await newCategory.save()
        if (!saveCategory) {
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

// fetch all category
const getCategory = async (req, res, next) => {
    try {

        // const categories = await Category.find().populate('products').sort({ _id: 1 })
        const categories = await Category.find().sort({ _id: 1 })

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

// fetch single category
const showCategory = async (req, res, next) => {
    let { id } = req.params

    try {
        const category = await Category.findById({ _id: id })
        if (!category) {
            return res.status(204).json({ message: 'Category not found' })
        }
        res.status(200).json({
            id: category._id,
            name: category.name,
            image: URL + "uploads/category/" + category.image
        })

    } catch (error) {
        next(error)
    }
}

// Update Category name
const updateCategory = async (req, res, next) => {
    let { id } = req.params
    let updateData = req.body

    try {
        let category = await Category.findOne({ _id: id }).exec()
        if (!category) {
            return res.status(204).json({ message: 'Category not found' })
        }

        let categoryByName = await Category.findOne({ name: req.body.name }).exec()
        if (!categoryByName) {
            const updateCateg = await Category.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { new: true }
            ).exec()

            if (!updateCateg) {
                return res.status(401).json({ message: 'Failed to update' })
            }
            return res.status(200).json({ message: true })
        }
        res.status(409).json({ message: 'Category name already exist' })

    } catch (error) {
        next(error)
    }

}


// update category image
const updateCategoryImage = async (req, res, next) => {
    let { id } = req.params

    try {
        let category = await Category.findOne({ _id: id }).exec()
        if (!category) {
            return res.status(204).json({ message: 'Category not found' })
        }

        let file = req.files.cat_image
        if (!file) {
            return res.status(204).json({ message: 'Select image first' })
        }
        const cat_image = Date.now() + '.' + file.name
        catImageUploadPath = './uploads/category/' + Date.now() + '.' + file.name
        const moveFile = file.mv(catImageUploadPath)

        if (!moveFile) {
            return res.status(501).json({ message: 'file upload error' })
        }

        const updateCategImg = await Category.findOneAndUpdate(
            { _id: id },
            { $set: { 'image': cat_image } },
            { new: true }
        ).exec()

        if (!updateCategImg) {
            return res.status(401).json({ message: 'Failed to update' })
        }
        return res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


// delete category
const deleteCategory = async (req, res, next) => {
    let { id } = req.params

    try {
        let category = await Category.findOneAndDelete({ _id: id }).exec()
        if (!category) {
            return res.status(204).json({ message: false })
        }
        res.status(200).json({ message: true })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createCategory,
    getCategory,
    showCategory,
    updateCategory,
    updateCategoryImage,
    deleteCategory
}
const Category = require('../../../models/Category')
const URL = require('../../../url')

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

const getCategory = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ _id: -1 })

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

const updateCategory = async (req, res, next) => {

}

const deleteCategory = async (req, res, next) => {

}


module.exports = {
    createCategory,
    getCategory,
    showCategory,
    updateCategory,
    deleteCategory
}
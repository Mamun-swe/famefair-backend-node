const { Schema, model } = require("mongoose")

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Category = model('category', categorySchema)

module.exports = Category;
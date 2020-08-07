const { Schema, model } = require("mongoose")

const productSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    product_code: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Product = model('Product', productSchema)

module.exports = Product;
const { Schema, model } = require("mongoose")

const bannerSchema = new Schema({
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Banner = model('banner', bannerSchema)

module.exports = Banner;
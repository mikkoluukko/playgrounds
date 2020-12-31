const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const playgroundSchema = new Schema(
    {
        title: String,
        images: [imageSchema],
        geometry: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        equipment: [
            {
                type: String,
                enum: [
                    'Swing',
                    'Slide',
                    'Sandbox',
                    'Baby Swing',
                    'Seesaw',
                    'Carousel',
                    'Climbing',
                    'Bench',
                    'Web Swing',
                ],
            },
        ],
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
    },
    opts
);

playgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/playgrounds/${this._id}">${this.title}</strong>`;
});

// findByIdAndDelete from index.js fires up this middleware.
// Deleted playground is passed down to deleteMany where it checks for and deletes
// reviews whose id can be found in the playground's reviews array
playgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Playground', playgroundSchema);

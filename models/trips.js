const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comments')

const opts = { toJSON: { virtuals: true } };

const tripSchema = new Schema({
    place: String,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, opts)

tripSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/trips/${this._id}">${this.place}</a><strong>
    <p class="popUpMarkup">${this.owner.username}</p>
    `
});


tripSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Trip', tripSchema)
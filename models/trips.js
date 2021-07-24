const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comments')

const tripSchema = new Schema({
    place: String,
    description: String,
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
})

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
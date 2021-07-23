const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema({
    place: String,
    description: String
})

module.exports = mongoose.model('Trip', tripSchema)
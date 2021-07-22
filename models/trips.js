const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema({
    title: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Trip', tripSchema)
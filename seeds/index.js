const express = require('express')
const app = express()
const cities = require('./cities')
const mongoose = require('mongoose')
const Trip = require('../models/trips')


mongoose.connect('mongodb://localhost:27017/myTrip', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection
    .on("error", console.error.bind(console, "connection error:"))
    .once("open", () => {
        console.log("Database connected");
    })

const seedDB = async () => {
    await Trip.deleteMany({})
    for (let i = 0; i < 20; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const trip = new Trip({
            place: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, nisi'
        })
    await trip.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
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
    for (let i = 0; i < 10; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const trip = new Trip({
            owner: "60ff6faced668109ecf9b7d6",
            place: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, nisi',
            images: [{
                url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1627352845/NOMADS/zriul4yif33glk8jujik.jpg',
                filename: 'NOMADS/zriul4yif33glk8jujik'
              },
              {
                url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1627352845/NOMADS/aek2a3eo3yyiudb9vs2y.jpg',
                filename: 'NOMADS/aek2a3eo3yyiudb9vs2y'
              }]
        })
    await trip.save()
    console.log(trip)
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
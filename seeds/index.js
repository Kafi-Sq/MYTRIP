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
/* final commit */

mongoose.connection
    .on("error", console.error.bind(console, "connection error:"))
    .once("open", () => {
        console.log("Database connected");
    })

const seedDB = async () => {
    await Trip.deleteMany({})
    for (let i = 0; i < 100; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const trip = new Trip({
            owner: "610c9b883ad652173ca963d7",
            place: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, nisi',
            images: [{
                url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1628188672/NOMADS/dkwu2a29pkp51ezdqkhn.jpg',
                filename: 'NOMADS/pcwkbwxusqwjfeskncfk'
              },
              {
                url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1628207686/NOMADS/pcwkbwxusqwjfeskncfk.jpg',
                filename: 'NOMADS/dkwu2a29pkp51ezdqkhn'
              },
              {
                url: 'https://res.cloudinary.com/nbrvchhc/image/upload/v1627929161/NOMADS/rjx1mdpdxytvl05qocff.jpg',
                filename: 'NOMADS/rjx1mdpdxytvl05qocff'
              }],
              geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
        })
    await trip.save()
    console.log(trip)
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
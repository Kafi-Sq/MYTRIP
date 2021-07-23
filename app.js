// things the app needs
const express = require('express')
const app = express()
const path = require('path')
const Trip = require('./models/trips')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const mongoose = require('mongoose')

// connecting to Mongodb
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

// app.
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/trips', catchAsync(async(req, res) => {
    const trip = await Trip.find({})
    res.render('index', {trip})
}))

app.get('/trips/new', (req, res) => {
    res.render('new')
})

app.post('/trips', catchAsync, (async(req, res) => {
    const trip = new Trip(req.body.trip)
    await trip.save()
    res.redirect('trips')
}))

app.get('/trips/:id', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    res.render('show', {trip})
}))

app.get('/trips/:id/edit', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    res.render('edit', {trip})
}))

app.put('/trips/:id', catchAsync, (async(req, res) => {
    const {id} = req.params
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip})
    res.redirect(`/trips/${trip._id}`)
}))

app.delete('/trips/:id', catchAsync(async(req, res) => {
    const {id} = req.params
    await Trip.findByIdAndDelete(id)
    res.redirect('/trips')
}))

// error handling

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// listening 
app.listen(8080, () => {
    console.log('Listening: 8080')
})
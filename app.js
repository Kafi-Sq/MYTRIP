// things the app needs
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const mongoose = require('mongoose')
const tripRoutes = require('./routes/trips')
const commentRoutes = require('./routes/comments')

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

app.use('/trips', tripRoutes)
app.use('/trips/:id/comments', commentRoutes)


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
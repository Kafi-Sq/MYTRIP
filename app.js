if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

// things the app needs
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const mongoose = require('mongoose')
const tripRoutes = require('./routes/trips')
const commentRoutes = require('./routes/comments')
const userRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/users')
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const MongoDBStore = require("connect-mongo")(session);
// connecting to Mongodb

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/myTrip';
mongoose.connect(dbUrl, {
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
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.deleted = req.flash('delete')
    res.locals.error = req.flash('error')
    next()
})

// routes
app.get('/home', (req, res) => {
    res.render('home')
})

app.use('/', userRoutes)
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
/* final commit */
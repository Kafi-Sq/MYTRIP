const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/users')
const passport = require('passport')

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', catchAsync(async(req, res, next) => {
    try {
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next()
            req.flash('success', 'Welcome to Nomads!')
            res.redirect('/trips')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}))

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/trips'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Bye!')
    res.redirect('/trips')
})

module.exports = router
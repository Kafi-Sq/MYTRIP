const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/users')
const passport = require('passport')

router.get('/signup', userController.signup)

router.post('/signup', catchAsync(userController.postSignup))

router.get('/login', userController.login)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.postLogin)

router.get('/logout', userController.logout)

module.exports = router
/* final commit */
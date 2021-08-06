const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/users')
const passport = require('passport')

router.route('/signup')
    .get(userController.signup)
    .post( catchAsync(userController.postSignup))

router.route('/login')
    .get(userController.login)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.postLogin)

router.get('/logout', userController.logout)

module.exports = router
/* final commit */
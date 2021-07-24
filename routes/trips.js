const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Trip = require('../models/trips')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn} = require('../middleware')

router.get('/', catchAsync(async(req, res) => {
    const trip = await Trip.find({})
    res.render('index', {trip})
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new')
})

router.post('/', isLoggedIn, async(req, res) => {
    const trip = new Trip(req.body.trip)
    await trip.save()
    req.flash('success', 'Trip Added!')
    res.redirect(`/trips/${trip._id}`)
})

router.get('/:id', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id).populate('comments')
    res.render('show', {trip})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    res.render('edit', {trip})
}))

router.put('/:id', isLoggedIn, catchAsync (async(req, res) => {
    const trip = await Trip.findByIdAndUpdate(req.params.id, {...req.body.trip})
    res.redirect(`/trips/${trip._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params
    await Trip.findByIdAndDelete(id)
    req.flash('delete', 'Deleted Trip!')
    res.redirect('/trips')
}))

module.exports = router
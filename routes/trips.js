const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Trip = require('../models/trips')
const ExpressError = require('../utils/ExpressError')

router.get('/', catchAsync(async(req, res) => {
    const trip = await Trip.find({})
    res.render('index', {trip})
}))

router.get('/new', (req, res) => {
    res.render('new')
})

router.post('/', async(req, res) => {
    const trip = new Trip(req.body.trip)
    await trip.save()
    res.redirect('/trips')
})

router.get('/:id', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id).populate('comments')
    res.render('show', {trip})
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    res.render('edit', {trip})
}))

router.put('/:id', catchAsync, (async(req, res) => {
    const {id} = req.params
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip})
    res.redirect(`/trips/${trip._id}`)
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params
    await Trip.findByIdAndDelete(id)
    res.redirect('/trips')
}))

module.exports = router
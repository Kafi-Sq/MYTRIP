const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Trip = require('../models/trips')
const {isLoggedIn, isOwner} = require('../middleware')



router.get('/', catchAsync(async(req, res) => {
    const trip = await Trip.find({})
    res.render('index', {trip})
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new')
})

router.post('/', isLoggedIn, async(req, res) => {
    const trip = new Trip(req.body.trip)
    trip.owner = req.user._id
    await trip.save()
    console.log(trip)
    req.flash('success', 'Trip Added!')
    res.redirect(`/trips/${trip._id}`)
})

router.get('/:id', catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'owner'
        }
    }).populate('owner')
    if (!trip) {
        req.flash('error', `Sorry, can't find that trip`)
        return res.redirect('/trips')
    }
    console.log(trip)
    res.render('show', {trip})
}))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    if(!trip){
        req.flash('error', `Sorry, can't find that trip`)
        return res.redirect('/trips')
    }
    res.render('edit', {trip})
}))

router.put('/:id', isLoggedIn, isOwner, catchAsync (async(req, res) => {
    const {id} = req.params
    const trip = await Trip.findByIdAndUpdate(req.params.id, {...req.body.trip})
    req.flash('success', 'Updated Trip!')
    res.redirect(`/trips/${trip._id}`)
}))

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async(req, res) => {
    const {id} = req.params
    await Trip.findByIdAndDelete(id)
    req.flash('delete', 'Deleted Trip!')
    res.redirect('/trips')
}))

module.exports = router
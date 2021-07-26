const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const tripController = require('../controllers/trips')
const {isLoggedIn, isOwner} = require('../middleware')



router.get('/', catchAsync(tripController.index))

router.get('/new', isLoggedIn, tripController.newTrip)

router.post('/', isLoggedIn, tripController.postTrip)

router.get('/:id', catchAsync(tripController.getSingleTrip))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(tripController.editTrip))

router.put('/:id', isLoggedIn, isOwner, catchAsync (tripController.postEdit))

router.delete('/:id', isLoggedIn, isOwner, catchAsync(tripController.deleteTrip))

module.exports = router
const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const tripController = require('../controllers/trips')
const {isLoggedIn, isOwner} = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({storage})
const Trip = require('../models/trips')


router.route('/')
    .get(catchAsync(tripController.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(tripController.postTrip))

router.get('/new', isLoggedIn, tripController.newTrip)

router.route('/:id')
 .get(catchAsync(tripController.getSingleTrip))
 .put(isLoggedIn, isOwner, upload.array('image'), catchAsync (tripController.postEdit))
 .delete(isLoggedIn, isOwner, catchAsync(tripController.deleteTrip))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(tripController.editTrip))


module.exports = router
const Trip = require('../models/trips')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const token = process.env.TOKEN
const geoCoder = mbxGeocoding({accessToken: token})
const { cloudinary } = require('../cloudinary')


module.exports.index = async(req, res) => {
    const trip = await Trip.find({}).populate({path: 'owner'})
    res.render('trips/index', {trip})
}

module.exports.newTrip = (req, res) => {
    res.render('trips/new')
}

module.exports.postTrip = async(req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.trip.place,
        limit: 1
    }).send()
    const trip = new Trip(req.body.trip)
    trip.geometry = geoData.body.features[0].geometry
    trip.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    trip.owner = req.user._id
    await trip.save()
    // console.log(trip)
    req.flash('success', 'Trip Added!')
    res.redirect(`/trips/${trip._id}`)
}

module.exports.getSingleTrip = async(req, res) => {
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
    res.render('trips/show', {trip})
}

module.exports.editTrip = async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    if(!trip){
        req.flash('error', `Sorry, can't find that trip`)
        return res.redirect('/trips')
    }
    res.render('trips/edit', {trip})
}

module.exports.postEdit = async(req, res) => {
    const {id} = req.params
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    trip.images.push(...imgs)
    await trip.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await trip.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(trip)
    }
    req.flash('success', 'Updated Trip!')
    res.redirect(`/trips/${trip._id}`)
}

module.exports.deleteTrip = async(req, res) => {
    const {id} = req.params
    const trip = await Trip.findByIdAndDelete(id)
    for (let image of trip.images) {
        await cloudinary.uploader.destroy(image.filename);
      }
    req.flash('delete', 'Deleted Trip!')
    res.redirect('/trips')
}
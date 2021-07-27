const Trip = require('../models/trips')
const { cloudinary } = require('../cloudinary')


module.exports.index = async(req, res) => {
    const trip = await Trip.find({})
    res.render('index', {trip})
}

module.exports.newTrip = (req, res) => {
    res.render('new')
}

module.exports.postTrip = async(req, res) => {
    const trip = new Trip(req.body.trip)
    trip.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    trip.owner = req.user._id
    await trip.save()
    console.log(trip)
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
    console.log(trip)
    res.render('show', {trip})
}

module.exports.editTrip = async(req, res) => {
    const id = req.params.id
    const trip = await Trip.findById(id)
    if(!trip){
        req.flash('error', `Sorry, can't find that trip`)
        return res.redirect('/trips')
    }
    res.render('edit', {trip})
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
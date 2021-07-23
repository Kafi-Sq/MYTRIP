const express = require('express')
const router = express.Router({mergeParams: true})
    // router keeps params separate so without mergeParams, findById is gonna return null
const catchAsync = require('../utils/catchAsync')
const Trip = require('../models/trips')
const ExpressError = require('../utils/ExpressError')
const Comment = require('../models/comments')


router.post('/', catchAsync(async(req, res) => {
    const trip = await Trip.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    trip.comments.push(comment)
    await comment.save()
    await trip.save()
    res.redirect(`/trips/${trip._id}`)
}))

router.delete('/:commentId', async(req, res) => {
    const {id, commentId} = req.params
    await Trip.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    req.flash('delete', 'Deleted!')
    res.redirect(`/trips/${id}`)
})

module.exports = router

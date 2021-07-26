const express = require('express')
const router = express.Router({mergeParams: true})
    // router keeps params separate so without mergeParams, findById is gonna return null
const catchAsync = require('../utils/catchAsync')
const commentController = require('../controllers/comments')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn, isCommentOwner} = require('../middleware')


router.post('/', isLoggedIn, catchAsync(commentController.postComment))

router.delete('/:commentId', isLoggedIn, isCommentOwner, commentController.deleteComment)

module.exports = router

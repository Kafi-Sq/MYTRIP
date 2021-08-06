const Trip = require('./models/trips')
const Comment = require('./models/comments')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params
    const trip = await Trip.findById(id)
    if(!trip.owner.equals(req.user._id)){
        req.flash('error', `You don't have permission to do that!`)
        return res.redirect(`/trips${id}`)
    }
    next()
}
module.exports.isCommentOwner = async(req, res, next) => {
    const {id, commentId} = req.params
    const comment = await Comment.findById(commentId)
    if(!comment.owner.equals(req.user._id)){
        req.flash('error', `You don't have permission to do that!`)
        return res.redirect(`/trips${id}`)
    }
    next()
}
/* final commit */

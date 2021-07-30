const User = require('../models/users')

module.exports.signup = (req, res) => {
    res.render('users/signup')
}

module.exports.postSignup = async(req, res, next) => {
    try {
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next()
            req.flash('success', 'Welcome to Nomads!')
            res.redirect('/trips')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}

module.exports.login = (req, res) => {
    res.render('users/login')
}

module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/trips'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'Bye!')
    res.redirect('/trips')
}
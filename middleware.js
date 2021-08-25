module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl // store the most recent URL in the session
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do this');
        return res.redirect('/login');
    }
    next();
}
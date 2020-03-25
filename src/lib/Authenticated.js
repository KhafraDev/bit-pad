const authenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } 

    return res.status(400).redirect('/login');
}

module.exports = authenticated;
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    //torando user visivel para as views
    res.locals.user = req.session.user
    return next()
  }
  return res.redirect('/')
}
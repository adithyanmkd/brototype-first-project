const auth = (req, res, next) => {
  console.log(req.path);
  if (req.path == '/logout') {
    return next();
  }
  if (req.session.user) {
    return res.redirect('/');
  }

  next();
};

export { auth };

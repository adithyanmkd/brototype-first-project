const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  req.user = req.session.user;
  next();
};

export { auth };

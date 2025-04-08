const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  next();
};

export { auth };

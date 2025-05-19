const auth = (req, res, next) => {
  console.log(req.headers.accept?.includes('application/json'));
  if (
    (req.xhr || req.headers.accept?.includes('application/json')) &&
    !req.session.user
  ) {
    console.log('printing here');
    return res.json({ success: false, message: 'Please login' });
  }

  if (!req.session.user) {
    console.log('printing here');
    return res.redirect('/auth/login');
  }

  req.user = req.session.user;
  next();
};

export { auth };

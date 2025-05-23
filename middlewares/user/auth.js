const auth = (req, res, next) => {
  console.log(
    req.headers.accept?.includes('application/json'),
    'is fetch request'
  );
  if (
    (req.xhr || req.headers.accept?.includes('application/json')) &&
    !req.session.user
  ) {
    return res.json({ success: false, message: 'Please login' });
  }

  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  req.user = req.session.user;
  next();
};

export { auth };

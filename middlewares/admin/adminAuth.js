const adminAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next(); // Admin is authenticated, proceed to the next middleware
  } else {
    res.redirect('/admin/auth/login'); // Redirect to login page if not authenticated
  }
};

export default adminAuth;

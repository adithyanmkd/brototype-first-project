import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log(token);

  if (!token) {
    return res.redirect('/admin/auth/login');
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.redirect('/admin/auth/login');
    }

    req.admin = decoded; // Attach admin info to request
    next();
  });
};

export { authenticateToken };

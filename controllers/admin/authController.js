import authData from '../../datasets/authData.js';

import jwt from 'jsonwebtoken';

//get login
const getLogin = (req, res) => {
  res.render('admin/pages/auth/login', {
    layout: 'layouts/auth-layout',
    title: 'admin login',
    authData,
  });
};

//post admin login
const authenticateAdmin = (req, res) => {
  const { username, password } = req.body;
  try {
    if (
      username == process.env.ADMIN_NAME &&
      password == process.env.ADMIN_PASS
    ) {
      const payload = { username: process.env.ADMIN_NAME };

      // generate token
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      res
        .status(200)
        .json({ success: true, message: 'Admin login successfull', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authenticate side server error',
      error,
    });
  }
};

export default {
  getLogin,
  authenticateAdmin,
};

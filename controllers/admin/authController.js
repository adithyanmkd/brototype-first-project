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
      username === process.env.ADMIN_NAME &&
      password === process.env.ADMIN_PASS
    ) {
      // Set admin session
      req.session.isAdmin = true;

      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        redirect: '/admin/dashboard', // Redirect to admin dashboard
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error,
    });
  }
};

//admin logout
const adminLogout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out',
        error: err,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully',
    });
  });
};

export default {
  getLogin,
  authenticateAdmin,
  adminLogout,
};

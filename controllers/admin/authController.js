import authData from '../../datasets/authData.js';

// import utils
import { HTTP_STATUS } from '../../utils/constants.js';

//get login
const getLogin = (req, res) => {
  try {
    res.render('admin/pages/auth/login', {
      layout: 'layouts/auth-layout',
      title: 'admin login',
      authData,
    });
  } catch (error) {
    console.error(error);
  }
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Admin login successful',
        redirect: '/admin/dashboard', // Redirect to admin dashboard
      });
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error during authentication',
      error,
    });
  }
};

//admin logout
const adminLogout = (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Error logging out',
          error: err,
        });
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Admin logged out successfully',
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export default {
  getLogin,
  authenticateAdmin,
  adminLogout,
};

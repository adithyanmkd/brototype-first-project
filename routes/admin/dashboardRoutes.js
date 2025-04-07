import express from 'express';

const router = express.Router();

// import controller
import dashboardController from '../../controllers/admin/dashboardController.js';

// import middlewares
import adminSidebar from '../../middlewares/admin/sidemenu.js';

// adding app level middleware
router.use(adminSidebar);

router.get('/', dashboardController.getDashboard); // get dashboard
router.get('/user-chart', dashboardController.getUserChartData); // get user chart

// export router
export default router;

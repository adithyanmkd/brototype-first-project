import express from 'express';

const router = express.Router();

// import controller
import dashboardController from '../../controllers/admin/dashboardController.js';
import salesReportController from '../../controllers/admin/salesReportController.js';

// import middlewares
import adminSidebar from '../../middlewares/admin/sidemenu.js';

// adding app level middleware
router.use(adminSidebar);

router.get('/', dashboardController.getDashboard); // get dashboard
router.get('/user-chart', dashboardController.getUserChartData); // get user chart
// router.get('/sales-report', salesReportController.getSalesReport); // get sales report

// export router
export default router;

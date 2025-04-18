import express from 'express';

import salesReportController from '../../controllers/admin/salesReportController.js';

const router = express.Router();

router.get('/', salesReportController.getSalesReport); // get sales report

export default router;

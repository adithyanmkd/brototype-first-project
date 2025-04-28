import { userChart } from '../handlers/adminChartHandler.js';

const token = localStorage.getItem('adminToken');

document.addEventListener('DOMContentLoaded', async () => {
  userChart();
});

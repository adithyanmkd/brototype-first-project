import { userChart, revenueChart } from '../handlers/adminChartHandler.js';

// const token = localStorage.getItem('adminToken');

document.addEventListener('DOMContentLoaded', async () => {
  userChart();

  // default chart
  revenueChart(7);

  document
    .querySelectorAll('#revenueDaysDropdown a[data-range]')
    .forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        const range = parseInt(e.target.dataset.range); // Get selected range

        document.getElementById('revenueDropdownText').innerText =
          e.target.innerText;

        // Call your chart function with selected range
        revenueChart(range);
      });
    });
});

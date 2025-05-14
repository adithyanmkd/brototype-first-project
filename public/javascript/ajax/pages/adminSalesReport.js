// import handlers
import { fetchSalesReport } from '../handlers/adminSalesHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  // Fetch default sales report (last 7 days)
  fetchSalesReport();

  // Handle range selection
  const salesRange = document.getElementById('sales-range');

  salesRange.addEventListener('change', (event) => {
    const range = event.target.value;

    if (range === 'custom') {
      document.getElementById('custom-date-range').classList.remove('hidden');
    } else {
      document.getElementById('custom-date-range').classList.add('hidden');
      fetchSalesReport(range);
    }
  });

  // Handle custom date range
  document.getElementById('end-date').addEventListener('change', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    console.log(startDate, endDate);

    if (startDate && endDate) {
      let result = fetchSalesReport('custom', startDate, endDate);
    }
  });

  document.getElementById('download-pdf').addEventListener('click', () => {
    const salesRange = document.getElementById('sales-range').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = `/admin/sales-report?format=pdf&range=${salesRange}`;
    if (salesRange === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    window.location.href = url;
  });

  document.getElementById('download-excel').addEventListener('click', () => {
    const salesRange = document.getElementById('sales-range').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = `/admin/sales-report?format=excel&range=${salesRange}`;
    if (salesRange === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    window.location.href = url; // Trigger Excel download
  });
});

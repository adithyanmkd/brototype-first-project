import { userChart } from '../handlers/adminChartHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  userChart();

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

    if (startDate && endDate) {
      let result = fetchSalesReport('custom', startDate, endDate);
      console.log(result);
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

const fetchSalesReport = async (range = '1w', startDate = '', endDate = '') => {
  try {
    let url = `/admin/sales-report?range=${range}`;
    if (range === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.data) {
      updateSalesReportUI(data.data);
    }
  } catch (error) {
    console.error('Error fetching sales report:', error);
  }
};

let currentPage = 1;
const rowsPerPage = 10;

const updateSalesReportUI = (salesData) => {
  document.getElementById('total-sales').textContent =
    `₹${salesData.totalSales}`;
  document.getElementById('total-discounts').textContent =
    `₹${salesData.totalDiscounts}`;
  document.getElementById('total-orders').textContent = salesData.totalOrders;

  const salesDetailsContainer = document.getElementById('sales-details');
  const paginationContainer = document.getElementById('pagination');
  salesDetailsContainer.innerHTML = ''; // Clear previous data
  paginationContainer.innerHTML = ''; // Clear previous pagination

  const totalRows = salesData.salesDetails.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Display rows for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const currentRows = salesData.salesDetails.slice(startIndex, endIndex);

  currentRows.forEach((sale) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-2 border border-gray-200">${sale.orderId}</td>
      <td class="px-4 py-2 border border-gray-200">₹${sale.totalAmount}</td>
      <td class="px-4 py-2 border border-gray-200">₹${sale.discountAmount || 0}</td>
      <td class="px-4 py-2 border border-gray-200">${new Date(sale.orderDate).toLocaleDateString()}</td>
      <td class="px-4 py-2 border border-gray-200">${sale.orderStatus || 'N/A'}</td>
    `;
    salesDetailsContainer.appendChild(row);
  });

  // Create pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = `px-3 py-1 mx-1 border rounded ${
      i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
    }`;
    button.addEventListener('click', () => {
      currentPage = i;
      updateSalesReportUI(salesData); // Re-render the table for the selected page
    });
    paginationContainer.appendChild(button);
  }
};

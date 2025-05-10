// import APIs
import { getSalesReport } from '../api/adminSalesApi.js';

// fetch sales report
const fetchSalesReport = async (range = '1w', startDate = '', endDate = '') => {
  try {
    const data = await getSalesReport(range, startDate, endDate);

    if (data && data.data) {
      updateSalesReportUI(data.data);
    }
  } catch (error) {
    console.error('Error fetching sales report:', error);
  }
};

let currentPage = 1;
const rowsPerPage = 10;

// update ui when admin change the date
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
        <td class="px-4 py-2 border border-gray-200">${sale.paymentMethod}</td>
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

export { fetchSalesReport };

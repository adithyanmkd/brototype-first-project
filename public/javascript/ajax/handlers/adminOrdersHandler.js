// import APIs
import { updateStatus, updateDescision } from '../api/adminOrdersApi.js';

let pathname = window.location.pathname;

// confirm btn handling
async function changeOrderStatus(e) {
  e.preventDefault();

  let btnName = e.target.value;
  let orderId = e.target.dataset.orderId;

  let response = await updateStatus(btnName, orderId);

  if (response.success) {
    window.location.reload();
  } else {
    console.error('update error', response.message);
    alert(`update error ${response.message || ''}`);
  }
}

// filter changing handler
function changeFilter(e) {
  let category = e.target.value;
  window.location.href = `/admin/orders?category=${category}`;
}

// approve and reject btn handler for order
async function decisionHandler(e) {
  let splitted = pathname.split('/');
  let orderId = splitted[splitted.length - 1];
  let action = e.target.value; // accessing action (approve or reject)

  let response = await updateDescision(orderId, action);

  if (response.success) {
    window.location.reload();
  } else {
    console.error('update error', response.message);
    alert(`update error ${response.message || ''}`);
  }
}

// search functionality
function searchOrder(e) {
  if (e.key == 'Enter') {
    let searchVal = e.target.value;
    window.location.href = `/admin/orders?search=${searchVal}`;
  }
}

export { changeOrderStatus, decisionHandler, changeFilter, searchOrder };

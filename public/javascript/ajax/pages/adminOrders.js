// import handlers
import { changeOrderStatus } from '../handlers/adminOrdersHandler.js';

let changeBtn = document.querySelectorAll('.change-btn');
let searchInput = document.getElementById('searchField');
let changeFilterBtn = document.querySelectorAll('.status-item');

changeBtn.forEach((btn) => {
  btn.addEventListener('click', changeOrderStatus);
});

// search functionality
searchInput.addEventListener('keydown', searchOrder);
function searchOrder(e) {
  if (e.key == 'Enter') {
    let searchVal = e.target.value;
    window.location.href = `/admin/orders?search=${searchVal}`;
  }
}

// filter functionality
changeFilterBtn.forEach((btn) => {
  btn.addEventListener('click', changeFilter);
});

function changeFilter(e) {
  let category = e.target.value;
  window.location.href = `/admin/orders?category=${category}`;
}

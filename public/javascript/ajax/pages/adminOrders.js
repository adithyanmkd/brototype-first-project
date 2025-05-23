// import handlers
import {
  changeOrderStatus,
  decisionHandler,
  changeFilter,
  searchOrder,
} from '../handlers/adminOrdersHandler.js';

let changeBtn = document.querySelectorAll('.change-btn');
let searchInput = document.getElementById('searchField');
let changeFilterBtn = document.querySelectorAll('.status-item');
let actionBtns = document.querySelectorAll('.action-btn');

changeBtn.forEach((btn) => {
  console.log(btn.value);
  btn.addEventListener('click', changeOrderStatus);
});

// search functionality
if (searchInput) {
  searchInput.addEventListener('keydown', searchOrder);
}

// filter functionality
if (changeFilterBtn) {
  changeFilterBtn.forEach((btn) => {
    btn.addEventListener('click', changeFilter);
  });
}

// approve and reject btn listening
actionBtns.forEach((btn) => {
  btn.addEventListener('click', decisionHandler);
});

let changeFilterBtn = document.querySelectorAll('.status-item'); // accessing filter value
let searchInput = document.getElementById('searchField'); // accessing search value
let returnBtnSubmit = document.querySelector('#returnSubmit');

// import helpers
import {
  searchOrder,
  changeFilter,
  submitResponse,
} from '../handlers/userOrdersHandler.js';

// search functionality
if (searchInput) {
  searchInput.addEventListener('keydown', searchOrder);
}

// filter functionality
changeFilterBtn.forEach((btn) => {
  btn.addEventListener('click', changeFilter);
});

if (returnBtnSubmit) {
  returnBtnSubmit.addEventListener('click', submitResponse);
}

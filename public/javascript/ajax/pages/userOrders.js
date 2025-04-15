let changeFilterBtn = document.querySelectorAll('.status-item'); // accessing filter value
let searchInput = document.getElementById('searchField'); // accessing search value
let returnBtnSubmit = document.querySelector('#returnSubmit');
let cancelSubmit = document.querySelector('#cancelSubmit');

// import helpers
import {
  searchOrder,
  changeFilter,
  submitResponse,
  processCancel,
} from '../handlers/userOrdersHandler.js';

// search functionality
if (searchInput) {
  searchInput.addEventListener('keydown', searchOrder);
}

// filter functionality
changeFilterBtn.forEach((btn) => {
  btn.addEventListener('click', changeFilter);
});

// return submit action listening
if (returnBtnSubmit) {
  returnBtnSubmit.addEventListener('click', submitResponse);
}

// cancel submit action listening
if (cancelSubmit) {
  cancelSubmit.addEventListener('click', processCancel);
}

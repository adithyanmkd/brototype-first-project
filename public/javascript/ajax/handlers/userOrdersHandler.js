// import APIs
import { returnOrderApi } from '../api/userOrdersApi.js';

// import utils
import { displayError } from '../utils/messages.js';

// search functionality
function searchOrder(e) {
  if (e.key == 'Enter') {
    let searchVal = e.target.value;
    window.location.href = `/account/orders?search=${searchVal}`;
  }
}

// change filter
function changeFilter(e) {
  let category = e.target.value;
  window.location.href = `/account/orders?category=${category}`;
}

// submit response
async function submitResponse() {
  let pathname = window.location.pathname;
  let reason = document.querySelector('#reason').value;

  let splited = pathname.split('/');
  let orderId = splited[splited.length - 1];

  if (!(reason.length > 0)) {
    displayError('Response is mandatory');
    return;
  }

  let response = await returnOrderApi(orderId, reason);

  if (response.success) {
    window.location.href = response.redirect;
  }
}

export { searchOrder, changeFilter, submitResponse };

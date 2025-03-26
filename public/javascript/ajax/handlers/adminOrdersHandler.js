// import APIs
import { updateStatus } from '../api/adminOrdersApi.js';

// confirm btn handling
async function changeOrderStatus(e) {
  e.preventDefault();

  let btnName = e.target.value;
  let orderId = e.target.dataset.orderId;

  let response = await updateStatus(btnName, orderId);
  if (response.success) {
    window.location.reload();
  } else {
    alert(`update error ${response.message || ''}`);
  }
}

export { changeOrderStatus };

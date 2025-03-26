// import handlers
import { changeOrderStatus } from '../handlers/adminOrdersHandler.js';

let changeBtn = document.querySelectorAll('.change-btn');

changeBtn.forEach((btn) => {
  btn.addEventListener('click', changeOrderStatus);
});

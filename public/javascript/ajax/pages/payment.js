// import handlers
import { handlePayment } from '../handlers/paymentHandler.js';

let payBtn = document.getElementById('pay-btn');

payBtn.addEventListener('click', handlePayment);

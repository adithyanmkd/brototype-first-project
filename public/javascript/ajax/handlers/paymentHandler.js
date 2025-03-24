// import APIs
import { processPayment } from '../api/paymentApi.js';

async function handlePayment(e) {
  e.preventDefault();

  let response = await processPayment('cash_on_delivery');

  if (response.success) {
    window.location.href = '/payment/success';
  } else {
    alert(`payment failed ${response.message || ''}`);
  }
}

export { handlePayment };

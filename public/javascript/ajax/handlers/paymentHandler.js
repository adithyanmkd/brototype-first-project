// import APIs
import { processPayment } from '../api/paymentApi.js';

// import utils
import { displayError } from '../utils/messages.js';

async function handlePayment(e) {
  e.preventDefault();

  let method = document.querySelector("input[name='paymentMethod']:checked");

  if (!method) {
    displayError('Please select a payment method');
    return;
  }

  let response = await processPayment(method.value);

  if (response.success && method.value === 'razorpay') {
    // Ensure Razorpay is loaded before using it
    if (typeof Razorpay === 'undefined') {
      console.error('Razorpay SDK not loaded');
      alert('Razorpay SDK failed to load. Please try again.');
      return;
    }

    const options = {
      key: response.key,
      amount: response.totalAmount * 100,
      name: response.user.name,
      currency: 'INR',
      order_id: response.order.id,
      handler: async function (paymentResponse) {
        console.log(paymentResponse);
        const verifyRes = await fetch(
          '/payment/success?payment_method=razorpay'
        );

        let data = await verifyRes.json();

        if (data.success) {
          console.log('-----------success----------');
          window.location.href = data.redirect;
        }
      },
      prefill: {
        name: response.user.name,
        email: response.user.email,
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } else if (response.success && method.value === 'cash_on_delivery') {
    window.location.href = '/payment/success?payment_method=cash_on_delivery';
  } else {
    alert(`payment failed ${response.message || ''}`);
  }
}

export { handlePayment };

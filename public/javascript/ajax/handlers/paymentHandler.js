// import APIs
import { processPayment } from '../api/paymentApi.js';

// import utils
import { displayError } from '../utils/messages.js';

async function handlePayment(e) {
  e.preventDefault();

  let method = document.querySelector("input[name='paymentMethod']:checked");

  let selectedMethod = method.value;

  if (!method) {
    displayError('Please select a payment method');
    return;
  }

  // process payment
  let response = await processPayment(selectedMethod);

  // error handling
  if (!response.success) {
    displayError(response.error || 'payment failed');
    return;
  }

  switch (selectedMethod) {
    case 'razorpay':
      await initiateRazorpayPayment(response);
      break;
    case 'cash_on_delivery':
      window.location.href = '/payment/success?payment_method=cash_on_delivery';
      break;
    case 'wallet':
      window.location.href = '/payment/success?payment_method=wallet';
      break;
    default:
      alert(`payment failed (default)  ${response.message || ''}`);
  }
}

// separating razorpay initialization
async function initiateRazorpayPayment(response) {
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
      const verifyRes = await fetch('/payment/success?payment_method=razorpay');

      let data = await verifyRes.json();

      if (data.success) {
        window.location.href = data.redirect;
      }
    },
    prefill: {
      name: response.user.name,
      email: response.user.email,
    },
    modal: {
      ondismiss: function () {
        window.location.href = '/payment/payment-failed';
      },
    },
  };

  const rzp = new Razorpay(options);

  rzp.on('payment.failed', function (response) {
    console.error('Payment Failed:', response.error);

    window.location.href = '/payment/payment-failed';
  });

  rzp.open();
}

export { handlePayment };

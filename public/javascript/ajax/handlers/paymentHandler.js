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
    // handler: async function (response) {
    //   try {
    //     await fetch('/payment/verify', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         razorpay_payment_id: response.razorpay_payment_id,
    //         razorpay_order_id: response.razorpay_order_id,
    //         razorpay_signature: response.razorpay_signature,
    //         amount: data.amount,
    //       }),
    //     })
    //       .then(async (res) => {
    //         let result = await res.json();

    //         if (!result.success) {
    //           console.error(result.message);
    //           return;
    //         }

    //         window.location.href = result.redirect;
    //       })
    //       .catch((err) => {
    //         alert(err);
    //         console.error(err);
    //       });
    //   } catch (error) {
    //     console.log(error);
    //     window.location.href = '/payment/payment-failed';
    //   }
    // },
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

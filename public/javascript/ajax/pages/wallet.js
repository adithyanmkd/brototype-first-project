// creating a function for top up wallet
window.topupWallet = async function (amount) {
  // amount validation
  if (!amount || amount < 0) alert('Please enter amount');

  try {
    let url = '/account/wallet/top-up';

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    let response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.error}`);
    }

    let data = await response.json();

    const options = {
      key: data.key,
      amount: data.amout * 100,
      name: data.user.name,
      currency: 'INR',
      order_id: data.order.id,
      handler: async function (response) {
        try {
          await fetch('/account/wallet/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: data.amount,
            }),
          })
            .then(async (res) => {
              let result = await res.json();

              if (!result.success) {
                console.error(result.message);
                return;
              }

              window.location.href = result.redirect;
            })
            .catch((err) => {
              alert(err);
              console.error(err);
            });
        } catch (error) {
          console.log(error);
          window.location.href = '/payment/payment-failed';
        }
      },
      prefill: {
        name: data.user.name,
        email: data.user.email,
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
  } catch (error) {
    console.error(error);
  }
};

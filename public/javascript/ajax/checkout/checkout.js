let checkoutForm = document.querySelector('#checkout-form');

checkoutForm.addEventListener('submit', postCheckoutForm);

async function postCheckoutForm(e) {
  e.preventDefault();
  let selectedAddress = document.querySelector("[name='isAddress']:checked");

  if (!selectedAddress) {
    alert('please choose a address');
    return;
  }

  let addressId = selectedAddress.value;

  try {
    let response = await fetch('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId }),
    });

    let data = await response.json();

    if (response.ok) {
      window.location.href = '/payment';
    } else {
      console.error('Error while posting checkout address');
    }
  } catch (error) {}
}

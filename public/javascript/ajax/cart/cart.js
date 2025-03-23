// delete item
async function deleteItem(productId, event) {
  event.preventDefault();
  try {
    let response = await fetch(`/cart/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    let data = await response.json();

    if (response.ok) {
      console.log('successfully deleted');
      window.location.href = '/cart';
    } else {
      console.error(data.message);
      window.location.href = '/cart/empty';
    }
  } catch (error) {
    console.log({ Error: error });
  }
}

// post form event listener
cartForm.addEventListener('submit', postCartForm);

// post cart function
async function postCartForm(e) {
  e.preventDefault();
  const cartItems = [];

  document.querySelectorAll('input.cart-item.hidden').forEach((item, index) => {
    cartItems[index] = {
      productId: item.dataset.productId,
      quantity: 0,
    };
  });

  document
    .querySelectorAll('.cart-item[data-quantity]')
    .forEach((item, index) => {
      cartItems[index].quantity = item.dataset.quantity;
    });

  try {
    const response = await fetch('/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });

    let data = await response.json();
    if (response.ok) {
      window.location.href = '/checkout';
    } else {
      console.error(data.error, 'error');
    }
  } catch (error) {
    console.log('error catch block');
  }
}

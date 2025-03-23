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

// update quantity needed elements ended
function updateQuantity(change, id, event, index) {
  event.preventDefault();
  let qtyElm = document.querySelector(
    `input[name='items[${index}][quantity]']`
  );

  let totalSellingPrice = document.querySelector(
    `div[name='items[${index}][totalSellingPrice]']`
  );

  let totalOriginalPrice = document.querySelector(
    `div[name='items[${index}][totalOriginalPrice]']`
  );

  let productSellingPrice = document.querySelector(
    `input[name='items[${index}][sellingPrice]']`
  ).value;

  let productOriginalPrice = document.querySelector(
    `input[name='items[${index}][originalPrice]']`
  ).value;
  let grandOriginal = document.querySelector('#grandOriginalPrice');
  let grandTotal = document.querySelector('#grandTotal');
  let grandDiscount = document.querySelector('#grandDiscount');

  qtyElm.value = Math.max(1, Number(qtyElm.value) + change);

  if (Number(qtyElm.value) > 3) {
    alert('purchase limit reached');
    qtyElm.value = 3;
  } else {
    totalSellingPrice.innerHTML = `₹${Number(qtyElm.value) * Number(productSellingPrice)}`;
    totalOriginalPrice.innerHTML = `₹${Number(qtyElm.value) * Number(productOriginalPrice)}`;

    // grand discount and grand original calculations
    let curDiscount = Number(grandDiscount.innerHTML.replace('₹', ''));
    let curOrginalPrice = Number(grandOriginal.innerHTML.replace('₹', ''));
    let curTotal = curOrginalPrice - curDiscount;

    let discount = Number(productOriginalPrice) - Number(productSellingPrice);
    if (change == 1) {
      grandDiscount.innerHTML = `₹${curDiscount + discount}`;
      grandOriginal.innerHTML = `₹${curOrginalPrice + Number(productOriginalPrice)}`;
      grandTotal.innerHTML = `₹${curTotal + Number(productSellingPrice)}`;
    } else if (change == -1) {
      grandDiscount.innerHTML = `₹${curDiscount - discount}`;
      grandOriginal.innerHTML = `₹${curOrginalPrice - Number(productOriginalPrice)}`;
      grandTotal.innerHTML = `₹${curTotal - Number(productSellingPrice)}`;
    }
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

// import api
import userCartApi from '../api/userCartApi.js';

let errorTimeout; // Store timeout reference

// display error
function displayError(message) {
  const errorBox = document.querySelector('#error-box');

  errorBox.classList.remove('hidden');
  errorBox.textContent = message;

  // Clear any existing timeout to prevent multiple timers
  clearTimeout(errorTimeout);

  // after 5 seconds message will be hide
  errorTimeout = setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 5000);
}

// hide error message
function hideError() {
  let errorBox = document.querySelector('#error-box');
  errorBox.classList.add('hidden');
}

// update quantity needed elements ended
// function updateQuantity(change, id, event, index) {
//   event.preventDefault();
//   let qtyElm = document.querySelector(
//     `input[name='items[${index}][quantity]']`
//   );

//   let totalSellingPrice = document.querySelector(
//     `div[name='items[${index}][totalSellingPrice]']`
//   );

//   let totalOriginalPrice = document.querySelector(
//     `div[name='items[${index}][totalOriginalPrice]']`
//   );

//   let productSellingPrice = document.querySelector(
//     `input[name='items[${index}][sellingPrice]']`
//   ).value;

//   let productOriginalPrice = document.querySelector(
//     `input[name='items[${index}][originalPrice]']`
//   ).value;
//   let grandOriginal = document.querySelector('#grandOriginalPrice');
//   let grandTotal = document.querySelector('#grandTotal');
//   let grandDiscount = document.querySelector('#grandDiscount');
//   let totalItems = document.querySelector('#totalItems');
//   let decreaseBtn = document.querySelector(
//     `button[name='items[${index}][decreaseBtn]']`
//   );

//   qtyElm.value = Math.max(1, Number(qtyElm.value) + change);

//   if (Number(qtyElm.value) > 3) {
//     alert('purchase limit reached');
//     qtyElm.value = 3;
//   } else {
//     totalSellingPrice.innerHTML = `₹${Number(qtyElm.value) * Number(productSellingPrice)}`;
//     totalOriginalPrice.innerHTML = `₹${Number(qtyElm.value) * Number(productOriginalPrice)}`;

//     // grand discount and grand original and grand total calculations
//     let curTotalItems = Number(totalItems.innerHTML);
//     let curDiscount = Number(grandDiscount.innerHTML.replace('₹', ''));
//     let curOrginalPrice = Number(grandOriginal.innerHTML.replace('₹', ''));
//     let curTotal = curOrginalPrice - curDiscount;

//     let discount = Number(productOriginalPrice) - Number(productSellingPrice);
//     if (change == 1) {
//       grandDiscount.innerHTML = `₹${curDiscount + discount}`;
//       grandOriginal.innerHTML = `₹${curOrginalPrice + Number(productOriginalPrice)}`;
//       grandTotal.innerHTML = `₹${curTotal + Number(productSellingPrice)}`;
//       totalItems.innerHTML = `${curTotalItems + 1}`;
//     } else if (change == -1) {
//       grandDiscount.innerHTML = `₹${curDiscount - discount}`;
//       grandOriginal.innerHTML = `₹${curOrginalPrice - Number(productOriginalPrice)}`;
//       grandTotal.innerHTML = `₹${curTotal - Number(productSellingPrice)}`;
//       totalItems.innerHTML = `${curTotalItems - 1}`;
//     }
//   }
// }

// post form event listener
cartForm.addEventListener('submit', postCartForm);

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
      cartItems[index].quantity = item.value;
    });

  // fetching user selected coupon
  let couponDiscount =
    document.querySelector('#couponDiscountValue')?.dataset.couponDiscount ||
    '';

  try {
    const response = await userCartApi.postCartApi({
      cartItems,
      couponDiscount,
    });

    if (response.success) {
      window.location.href = '/checkout';
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${error.message}` || 'Something went wrong.',
    });
  }

  // try {
  //   const response = await fetch('/cart', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ cartItems, couponDiscount }),
  //   });

  //   let data = await response.json();
  //   if (response.ok) {
  //     window.location.href = '/checkout';
  //   } else {
  //     displayError(`${data.product} ${data.message} `);
  //     console.error(data.message, 'error');
  //   }
  // } catch (error) {
  //   console.log('error catch block', error);
  // }
}

// bind into window object
window.deleteItem = deleteItem;

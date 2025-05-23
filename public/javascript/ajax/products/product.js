// import api
import userProductApi from '../api/userProductApi.js';

let addToCartForm = document.querySelector('#add-to-cart-form');

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

// product image changing
function changeImage(img) {
  document.querySelector('.main-image').src = img;
}

// Zoom functionality
document.addEventListener('DOMContentLoaded', function () {
  // image zooming feature
  const mainImage = document.querySelector('.main-image');

  mainImage.addEventListener('mousemove', function (event) {
    const { left, top, width, height } = this.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    this.style.transformOrigin = `${x}% ${y}%`;
    this.style.transform = 'scale(1.5)';
  });

  mainImage.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });
});

// update quantity needed elements
let sellingPriceEl = document.querySelector('#sellingPrice'); // selling price element accessing
let originalPriceEl = document.querySelector('#originalPrice');
let saveAmountEl = document.querySelector('#saveAmount');

let sellingPrice = 0;
let originalPrice = 0;
let saveAmount = 0;

if (sellingPriceEl) {
  sellingPrice = sellingPriceEl.innerHTML.replace('₹', '') || 0;
  originalPrice = originalPriceEl.innerHTML.replace('₹', '') || 0;
  saveAmount = saveAmountEl.innerHTML.replace('Save ₹', '') || 0;
}

// update quantity needed elements ended
async function updateQuantity(change, event) {
  event.preventDefault();

  let qty = parseInt(document.getElementById('quantity').value);

  qty = Math.max(1, qty + change);

  let url = window.location.pathname;
  let productId = url.split('/').pop();

  let data = await userProductApi.fetchProduct({ productId });

  if (!data.success) {
    console.error(data);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong',
    });
    return;
  }

  let product = data.product;

  // console.log(product.quantity);

  if (qty > product.quantity) {
    Swal.fire({
      icon: 'warning',
      title: 'Quantity Unavailable',
      text: `Sorry, the requested quantity is not available. Only ${product.quantity} units are in stock.`,
    });
    return;
  }

  if (qty > 3) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Max quantity reached!!',
    });
    return;
  }

  document.getElementById('quantity').value = qty;
  sellingPriceEl.innerHTML = `₹${qty * Number(sellingPrice)}`;
  originalPriceEl.innerHTML = `₹${qty * Number(originalPrice)}`;
  saveAmountEl.innerHTML = `₹${qty * Number(saveAmount)}`;
}

// items adding into cart
addToCartForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let quantity = addToCartForm.querySelector("[name='quantity']").value.trim();
  let productId = addToCartForm
    .querySelector("[name='productId']")
    .value.trim();

  try {
    let response = await fetch(`/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ quantity, productId }),
    });

    let data = await response.json();

    if (!data.success) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${data.message}`,
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/auth/login';
        }
      });
      return;
    }

    window.location.href = '/cart';

    // if (response.ok) {
    //   window.location.href = '/cart';
    // } else {
    //   if (data.message === 'User not found') {
    //     window.location.href = '/auth/login';
    //   } else if (data.message === 'Max product purchase reached') {
    //     return displayError(data.message);
    //   } else if (data.message === 'Product is out of stock') {
    //     return displayError(data.message);
    //   }
    // }
  } catch (error) {
    console.error({
      Error: error,
      message: 'Error while add to cart data into server',
    });
  }
});

// Expose the function to the global scope
window.updateQuantity = updateQuantity;
window.changeImage = changeImage;

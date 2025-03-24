let addToCartForm = document.querySelector('#add-to-cart-form');

// product image changing
function changeImage(img) {
  document.querySelector('.main-image').src = img;
}

// update quantity needed elements
let sellingPriceEl = document.querySelector('#sellingPrice'); // selling price element accessing
let originalPriceEl = document.querySelector('#originalPrice');
let saveAmountEl = document.querySelector('#saveAmount');

let sellingPrice = sellingPriceEl.innerHTML.replace('₹', '') || 0;
let originalPrice = originalPriceEl.innerHTML.replace('₹', '') || 0;
let saveAmount = saveAmountEl.innerHTML.replace('Save ₹', '') || 0;

// Zoom functionality
document.addEventListener('DOMContentLoaded', function () {
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

// update quantity needed elements ended
function updateQuantity(change, event) {
  event.preventDefault();

  let qty = parseInt(document.getElementById('quantity').value);

  qty = Math.max(1, qty + change);

  if (qty > 3) {
    alert('Max quantity reached!!');
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, productId }),
    });

    let data = await response.json();

    if (response.ok) {
      window.location.href = '/cart';
    } else {
      console.log(data.message);
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error({
      Error: error,
      message: 'Error while add to cart data into server',
    });
  }
});

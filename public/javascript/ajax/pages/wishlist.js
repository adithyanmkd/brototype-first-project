// import handler funcitons
import {
  handleWishlistDelete,
  handleWishlistToCart,
} from '../handlers/wishlistHandler.js';

document.addEventListener('DOMContentLoaded', scriptLoad);

function scriptLoad() {
  const delBtns = document.querySelectorAll('.deleteWishlist');
  const wishlistToCartForm = document.querySelectorAll('.wishlistToCartForm');

  delBtns.forEach((btn) => {
    btn.addEventListener('click', handleWishlistDelete);
  });

  wishlistToCartForm.forEach((form) => {
    form.addEventListener('submit', handleWishlistToCart);
  });
}

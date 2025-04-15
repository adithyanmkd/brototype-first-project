// import handlers
import { handleAddToWishlist } from '../handlers/userProductHandler.js';

let wishlistBtns = document.querySelectorAll('.wishlist-btn'); // accessing wishlist btn

// add to wishlist
wishlistBtns.forEach((btn) => {
  btn.addEventListener('click', handleAddToWishlist);
});

// add item into wishlist
// if (wishlistBtn) {
//   wishlistBtn.addEventListener('click', handleAddToWishlist);
// }

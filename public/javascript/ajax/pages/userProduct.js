// import handlers
import { handleAddToWishlist } from '../handlers/userProductHandler.js';

let wishlistBtn = document.querySelector('#wishlist-btn'); // accessing wishlist btn

// add item into wishlist
if (wishlistBtn) {
  wishlistBtn.addEventListener('click', handleAddToWishlist);
}

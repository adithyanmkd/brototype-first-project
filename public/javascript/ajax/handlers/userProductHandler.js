// import APIs
import { addToWishlistApi } from '../api/userProductApi.js';

// import toast notification
import { showToast } from '../utils/toast.js';

// accessing url
let pathname = window.location.pathname;

// add to wishlist item function
async function handleAddToWishlist(e) {
  e.preventDefault();
  let productId = pathname.split('/')[2];
  let response = await addToWishlistApi(productId);

  if (response.success) {
    showToast('toast-success', response.message);
  } else {
    // show error toast
    showToast('toast-danger', response.message || 'You are not logged');
  }
}

export { handleAddToWishlist };

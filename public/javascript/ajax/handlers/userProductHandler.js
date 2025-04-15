// import APIs
import { addToWishlistApi } from '../api/userProductApi.js';

// import toast notification
import { showToast } from '../utils/toast.js';

// accessing url
let pathname = window.location.pathname;

// add to wishlist item function
async function handleAddToWishlist(e) {
  e.preventDefault();

  // product details page wishlist btn
  let productId = e.target.dataset.productId;

  if (!productId) return false;

  let response = await addToWishlistApi(productId);

  if (response.success) {
    window.location.reload();
    showToast('toast-success', response.message);
  } else {
    if (!productId) return false;

    await fetch(`/account/wishlist/delete/${productId}`, {
      method: 'DELETE',
    });

    window.location.reload();

    showToast('toast-danger', response.message || 'You are not logged');
  }
}

export { handleAddToWishlist };

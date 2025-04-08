// import APIs
import { deleteWishlistApi } from '../api/wishlistApi.js';

// import toast notification
import { showToast } from '../utils/toast.js';

const handleWishlistDelete = async (e) => {
  e.preventDefault();
  let productId = e.currentTarget.dataset.productId;

  document.querySelector('#confirmBtn').addEventListener('click', async () => {
    let response = await deleteWishlistApi(productId);

    if (!response.success) {
      showToast('toast-danger', response.message);
    }

    showToast('toast-success', response.message);
    window.location.reload();
  });
};

export { handleWishlistDelete };

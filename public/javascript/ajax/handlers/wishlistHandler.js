// import APIs
import { deleteWishlistApi, wishlistToCartApi } from '../api/wishlistApi.js';

// import toast notification
import { showToast } from '../utils/toast.js';

// wishlist delete handler
const handleWishlistDelete = async ({ productId }) => {
  let response = await deleteWishlistApi(productId);

  if (!response.success) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${response.message}`,
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Deleted',
    text: `${response.message}`,
  }).then(() => {
    window.location.href = '/account/wishlist';
  });

  // document.querySelector('#confirmBtn').addEventListener('click', async () => {
  //   let response = await deleteWishlistApi(productId);

  //   if (!response.success) {
  //     showToast('toast-danger', response.message);
  //   }

  //   window.location.reload();
  // });
};

// wishlist to cart handler
const handleWishlistToCart = async (e) => {
  e.preventDefault();
  let productId = e.target.dataset.productId;
  let quantity = Number(e.target.dataset.qty);

  try {
    let response = await wishlistToCartApi(productId, quantity);

    if (!response.success) {
      Swal.fire({
        icon: 'error',
        title: `Oops...`,
        text: `${response.message}`,
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `${response.message}`,
    }).then(() => {
      window.location.reload();
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: `Oops...`,
      text: `${error.message}`,
    });
  }
};

export { handleWishlistDelete, handleWishlistToCart };

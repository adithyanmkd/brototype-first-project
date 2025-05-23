import userProductApi from '../api/userProductApi.js';

async function handleAddToWishlist(e) {
  e.preventDefault();
  const productId = e.target.dataset.productId;

  try {
    if (!productId) return false;

    const response = await userProductApi.addToWishlistApi(productId);
    if (response.success) {
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Success',
      //   text: 'Item added successfully.',
      //   timer: 2000,
      //   showConfirmButton: false,
      // }).then(() => {
      //   window.location.reload();
      // });

      window.location.reload();
    } else {
      if (!productId) return false;
      console.log('log here');

      await fetch(`/account/wishlist/delete/${productId}`, {
        method: 'DELETE',
      });

      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    console.log(error.message);

    if (error.message == 'product already added in wishlist') {
      if (!productId) return false;
      await fetch(`/account/wishlist/delete/${productId}`, {
        method: 'DELETE',
      });
      window.location.reload();
      return;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      // text: `${error.message}`,
      text: 'Please login',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/auth/login';
      }
    });
  }
}

function handleSearch(input) {
  return async (e) => {
    e.preventDefault();
    const searchValue = input.value.trim();
    console.log('Search value:', searchValue);
  };
}

export { handleAddToWishlist, handleSearch };

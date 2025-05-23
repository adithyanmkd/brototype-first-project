import userProductApi from '../api/userProductApi.js';

async function handleAddToWishlist(e) {
  e.preventDefault();
  const productId = e.target.dataset.productId;
  if (!productId) return false;

  const response = await userProductApi.addToWishlistApi(productId);
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

function handleSearch(input) {
  return async (e) => {
    e.preventDefault();
    const searchValue = input.value.trim();
    console.log('Search value:', searchValue);
    // The actual search logic is in userProduct.js to update the UI
  };
}

export { handleAddToWishlist, handleSearch };

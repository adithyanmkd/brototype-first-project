// delete wishilist item
const deleteWishlistApi = async (productId) => {
  try {
    let res = await fetch(`/account/wishlist/delete/${productId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('item delete failed');
      return data;
    }

    return data;
  } catch (error) {
    console.error({ Error: error });
    return { success: false, Error: error };
  }
};

// wishlist to cart item
const wishlistToCartApi = async (productId, quantity) => {
  try {
    let res = await fetch(`/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('item add to cart failed');
      return data;
    }

    return data;
  } catch (error) {
    console.error({ Error: error });
    return { success: false, Error: error };
  }
};

// export APIs
export { deleteWishlistApi, wishlistToCartApi };

const deleteWishlistApi = async (productId) => {
  console.log(productId);
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

// export APIs
export { deleteWishlistApi };

async function addToWishlistApi(productId) {
  try {
    let res = await fetch('/account/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    let data = await res.json();

    if (!res.ok) {
      console.error({ Error: data.message });
      return data;
    }
    return data;
  } catch (error) {
    console.error('Status update error', error);
    return { success: false };
  }
}

export { addToWishlistApi };

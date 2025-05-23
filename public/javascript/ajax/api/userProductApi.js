const userProductApi = {
  // add to wishlist api
  addToWishlistApi: async (productId) => {
    try {
      let res = await fetch('/account/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      console.error('Status update error', error);
      // return { success: false };
      throw error;
    }
  },

  // fetch product details
  fetchProduct: async ({ productId }) => {
    try {
      let url = `/products/${productId}`;

      let res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      let data = await res.json();

      // console.log(data);

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

// Attach to window for Alpine.js
window.userProductApi = userProductApi;

export default userProductApi;

const userCartApi = {
  // add to cart api
  postCartApi: async ({ cartItems, couponDiscount }) => {
    try {
      const res = await fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, couponDiscount }),
      });

      let data = await res.json();

      //   console.log(data);

      if (!res.ok) {
        console.log(data);
        throw new Error(data.message || 'something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default userCartApi;

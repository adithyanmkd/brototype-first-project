const adminProductAPI = {
  // add product api
  addProduct: async ({ formData }) => {
    let url = '/admin/products/add';

    try {
      let res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      return res;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Something went wrong. Try again.',
      };
    }
  },

  // edit product api
  editProduct: async ({ formData, productId }) => {
    try {
      let url = `/admin/products/edit/${productId}`;
      let res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  },
};

export default adminProductAPI;

const adminProductAPI = {
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
};

export default adminProductAPI;

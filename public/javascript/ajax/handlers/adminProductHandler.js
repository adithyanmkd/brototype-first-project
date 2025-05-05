// import APIs
import adminProductAPI from '../api/adminProductAPI.js';

const adminProductHandler = {
  // add product handler
  processAddProduct: async ({ formData }) => {
    try {
      let response = await adminProductAPI.addProduct({ formData });

      let data = await response.json();

      if (!data.success) {
        console.error(data);
        alert(data.message);
        return;
      }

      console.log(data.message);
      alert(data.message);
      window.location.href = data.redirect;
    } catch (error) {
      console.error(error);
    }
  },

  // edit product handler
  processEditProduct: async ({ formData, productId }) => {
    try {
      let response = await adminProductAPI.editProduct({ formData, productId });

      let data = await response.json();

      if (!data.success) {
        console.error(data);
        alert(data.message);
        return;
      }

      console.log(data.message);
      alert(data.message);
      window.location.href = data.redirect;
    } catch (error) {
      console.error(error);
    }
  },
};

export default adminProductHandler;

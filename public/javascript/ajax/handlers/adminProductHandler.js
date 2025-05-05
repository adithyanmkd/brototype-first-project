// import APIs
import adminProductAPI from '../api/adminProductAPI.js';

const adminProductHandler = {
  processAddProduct: async ({ formData }) => {
    try {
      let response = await adminProductAPI.addProduct({ formData });

      let data = await response.json();

      if (!data.success) {
        console.error(data);
        alert(data.message);
        return;
      }

      console.log(data);
      alert(data.message);
      window.location.href = data.redirect;
    } catch (error) {
      console.error(error);
    }
  },
};

export default adminProductHandler;

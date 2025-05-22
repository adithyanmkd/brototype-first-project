// sweat alert component for reusing
const showAlert = (title, text, icon = 'warning') => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
  });
};

// custom prototypes
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const validations = {
  // product name validation
  isValidName: ({ name }) => {
    if (validator.isEmpty(name))
      return showAlert('Error', 'Please enter the product name.', 'error');

    if (validator.isNumeric(name))
      return showAlert(
        'Error',
        'Product name must be text and cannot be a number.',
        'error'
      );

    if (!isNaN(Number(name[0])))
      return showAlert(
        'Invalid Name',
        'Product name cannot start with a number.',
        'warning'
      );

    if (!validator.isLength(name, { min: 3 }))
      return showAlert(
        'Invalid Name',
        'Product name must be at least 3 characters long.',
        'error'
      );

    // Allow only letters, numbers, space, -, (, )
    if (!/^[A-Za-z0-9\s\-\(\)]+$/.test(name)) {
      return showAlert(
        'Invalid Name',
        'Product name can only contain letters, numbers, spaces, and symbols (-, (, )).'
      );
    }

    // Must start with letter or number
    if (!/^[A-Za-z]/.test(name)) {
      return showAlert(
        'Invalid Name',
        'Product name must start with a letter.'
      );
    }

    return true; // if valid
  },

  // description validation
  isValidDescription: ({ description }) => {
    if (!description)
      return showAlert('Missing Field', 'Please enter a product description.');

    if (!/^[A-Za-z]/.test(description)) {
      return showAlert(
        'Invalid Start',
        'Description cannot start with a symbol.',
        'error'
      );
    }

    if (!validator.isLength(description, { min: 20 })) {
      return showAlert(
        'Error',
        'Description must be 20 characters long.',
        'error'
      );
    }

    if (!validator.isLength(description, { max: 1000 })) {
      return showAlert(
        'Too Long',
        'Description must not exceed 1000 characters.',
        'error'
      );
    }

    return true; // if valid
  },

  // price validation
  isValidPrice: ({ price, priceType }) => {
    if (!price)
      return showAlert('Missing Field', `Please enter the ${priceType} price.`);

    price = Number(price); // converting for validation

    if (price <= 0)
      return showAlert(
        'Invalid Input',
        `${priceType.capitalize()} price must be greater than 0.`,
        'error'
      );

    if (!(price >= 500 && price <= 100000))
      return showAlert(
        'Invalid Input',
        'Allowed price range: ₹500 to ₹100,000.',
        'error'
      );

    return true;
  },

  // quantity validation
  isValidQuantity: ({ quantity }) => {
    if (!quantity) {
      return showAlert('Missing Field', 'Please enter a quantity.', 'error');
    }

    quantity = Number(quantity); // converting

    if (quantity <= 0) {
      return showAlert(
        'Invalid Quantity',
        'Quantity must be greater than 0.',
        'error'
      );
    }

    const MAX_STOCK = 10000;
    if (quantity > MAX_STOCK)
      return showAlert(
        'Stock Limit Exceeded',
        `Quantity cannot exceed ${MAX_STOCK}.`,
        'error'
      );

    return true;
  },
};

export default validations;

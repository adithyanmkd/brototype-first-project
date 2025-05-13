function validateForm(event) {
  event.preventDefault();

  // Get form elements
  const form = document.getElementById('productOfferForm');
  const productId = form.querySelector('#productId');
  const discountPercentage = form.querySelector('#discountPercentage');
  const startDate = form.querySelector('#startDate');
  const endDate = form.querySelector('#endDate');

  // Get the form mode (create or edit) from a data attribute
  const isEditMode = form.dataset.mode === 'edit';

  if (!isEditMode) {
    if (!productId.value) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select a product.',
      });
      return false;
    }
  }

  const discountValue = parseFloat(discountPercentage.value);
  if (isNaN(discountValue) || discountValue < 0 || discountValue > 40) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Discount percentage must be between 0 and 40.',
    });
    return false;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  if (start > end) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Start date must be on or before end date.',
    });
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!isEditMode && start < today) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Start date cannot be in the past.',
    });
    return false;
  }

  // let body = new FormData(form);

  // body.forEach((val) => {
  //   console.log(val, 'form fields');
  // });

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: isEditMode ? 'Offer Updated' : 'Offer Created',
          text:
            data.message ||
            `Product offer has been successfully ${isEditMode ? 'updated' : 'created'}!`,
          showConfirmButton: true,
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.href = '/admin/offers/product';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            data.message ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the offer.`,
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
    });

  return false;
}

function goBack() {
  history.back();
}

function confirmDelete(event) {
  event.preventDefault();

  const form = event.target;
  const offerId = form.dataset.offerId;

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this product offer? This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // If the user confirms, submit the form via fetch
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
              title: 'Offer Deleted',
              text:
                data.message || 'Product offer has been successfully deleted!',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            }).then(() => {
              // Reload the page to refresh the offers list
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                data.message || 'An error occurred while deleting the offer.',
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
    }
  });

  return false;
}
// document.addEventListener('DOMContentLoaded', () => {
// });

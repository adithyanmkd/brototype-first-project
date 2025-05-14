document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;

  let errorTimeout; // Store timeout reference

  // show error message
  function displayError(message) {
    let errorBox = document.querySelector('#error-box'); // accessing error box

    errorBox.innerHTML = message;
    errorBox.classList.remove('hidden');

    // Clear any existing timeout to prevent multiple timers
    clearTimeout(errorTimeout);

    // after 5 seconds message will be hide
    errorTimeout = setTimeout(() => {
      errorBox.classList.add('hidden');
    }, 5000);
  }

  // show error message
  function displaySuccess(message) {
    let successBox = document.querySelector('#success-box'); // accessing success box

    successBox.innerHTML = message;
    successBox.classList.remove('hidden');

    // Clear any existing timeout to prevent multiple timers
    clearTimeout(successBox);

    // after 5 seconds message will be hide
    successTimeout = setTimeout(() => {
      successBox.classList.add('hidden');
    }, 5000);
  }

  // hide error message
  function hideError() {
    let errorBox = document.querySelector('#error-box');
    errorBox.classList.add('hidden');
  }

  const editForm = document.querySelector('#profile-edit-form');

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = editForm.querySelector('input[name="name"]').value.trim();
    const gender = editForm.querySelector('select[name="gender"]').value;
    const number = editForm.querySelector('input[name="number"]').value.trim();

    // Validation
    let errors = [];

    // Validate Full Name
    if (!name) {
      errors.push('Full Name is required.');
    } else if (name.length < 2) {
      errors.push('Full Name must be at least 2 characters long.');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push('Full Name must contain only letters and spaces.');
    }

    // Validate Gender
    if (!gender) {
      errors.push('Please select a gender.');
    }

    // Validate Phone Number
    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    if (!number) {
      errors.push('Phone Number is required.');
    } else if (!phoneRegex.test(number)) {
      errors.push('Phone Number must be a valid 10-digit number.');
    }

    // If there are validation errors, show them
    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: errors.join('<br>'),
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been updated successfully!',
      confirmButtonColor: '#3085d6',
    }).then(() => {
      // submit form after checking
      editForm.submit();
    });
  });
});

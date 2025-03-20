document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;

  if (pathname.includes('/account/my-details')) myDetails();

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

  function myDetails() {
    const editForm = document.querySelector('#profile-edit-form');

    editForm.addEventListener('submit', (e) => {
      console.log('profile form triggered');
    });
  }
});

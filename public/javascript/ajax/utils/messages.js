let successTimeout;
let errorTimeout; // Store timeout reference

// display error
function displayError(message) {
  const errorBox = document.querySelector('#error-box');

  errorBox.classList.remove('hidden');
  errorBox.textContent = message;

  // Clear any existing timeout to prevent multiple timers
  clearTimeout(errorTimeout);

  // after 5 seconds message will be hide
  errorTimeout = setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 5000);
}

// show success message
function displaySuccess(message) {
  let successBox = document.querySelector('#success-box'); // accessing success box

  successBox.innerHTML = message;
  successBox.classList.remove('hidden');

  // Clear any existing timeout to prevent multiple timers
  clearTimeout(successTimeout);

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

export { displayError, displaySuccess, hideError };

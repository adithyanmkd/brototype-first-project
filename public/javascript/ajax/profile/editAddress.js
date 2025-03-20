const editModal = document.getElementById('editModal');
const addModal = document.getElementById('addModal');

let errorTimeout; // Store timeout reference
let successTimeout;

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

// Show edit modal
function showEditModal() {
  editModal.classList.add('show');
  // Add click event listener to close modal when clicking outside
  editModal.addEventListener('click', closeModalOnOutsideClick);
}

// Close edit modal
function closeEditModal() {
  editModal.classList.remove('show');
  // Remove the event listener when modal is closed
  editModal.removeEventListener('click', closeModalOnOutsideClick);
}

// Show edit modal
function showAddModal() {
  addModal.classList.add('show');
  // Add click event listener to close modal when clicking outside
  addModal.addEventListener('click', closeModalOnOutsideClick);
}

// Close edit modal
function closeAddModal() {
  addModal.classList.remove('show');
  // Remove the event listener when modal is closed
  addModal.removeEventListener('click', closeModalOnOutsideClick);
}

// Close modal when clicking outside
function closeModalOnOutsideClick(event) {
  if (event.target === addModal) {
    closeAddModal();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let pathname = window.location.pathname;
});

// add address form validation and ajax
const addForm = document.getElementById('add-address-form');

// Add submit event listener
addForm.addEventListener('submit', validateAddForm);

// add form validation
async function validateAddForm(event) {
  event.preventDefault();

  // Get form values
  const fullName = document.querySelector('[name="fullname"]').value.trim();
  const email = document.querySelector('[name="email"]').value.trim();
  const phoneNumber = document
    .querySelector('[name="phoneNumber"]')
    .value.trim();
  const address = document.querySelector('[name="address"]').value.trim();
  const pincode = document.querySelector('[name="pincode"]').value.trim();
  const district = document.querySelector('[name="district"]').value.trim();
  const state = document.querySelector('[name="state"]').value.trim();
  const locality = document.querySelector('[name="locality"]').value.trim();
  const isDefault = document.querySelector('[name="isDefault"]').checked;
  console.log(isDefault);

  // Regex for email, phone number, and pincode
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;
  const pincodePattern = /^[0-9]{6}$/;

  // Validation Checks
  if (!fullName) {
    displayError('Full name is required');
    return;
  }

  if (!email || !emailPattern.test(email)) {
    displayError('Enter a valid email');
    return;
  }

  if (!phoneNumber || !phonePattern.test(phoneNumber)) {
    displayError('Enter a valid 10-digit phone number');
    return;
  }

  if (!address) {
    displayError('Address is required');
    return;
  }

  if (!pincode || !pincodePattern.test(pincode)) {
    displayError('Enter a valid 6-digit pincode');
    return;
  }

  if (!district) {
    displayError('District is required');
    return;
  }

  if (!state) {
    displayError('State is required');
    return;
  }

  hideError();

  let body = {
    name: fullName,
    email,
    phone: phoneNumber,
    address,
    locality,
    pincode,
    district,
    state,
    isDefault,
  };

  try {
    let response = await fetch('/account/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    let data = await response.json();

    if (response.ok) {
      alert('Success');
    } else {
      alert('Failed', data.message);
    }
  } catch (error) {}
}

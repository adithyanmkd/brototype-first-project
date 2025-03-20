let errorTimeout; // Store timeout reference
let successTimeout;

// display error
function displayError(message) {
  const errorBox = document.querySelector('#error-box');

  errorBox.classList.remove('hidden');
  errorBox.innerHTML = message;

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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('passwordForm');
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const submitButton = document.getElementById('submitButton');
  const requirements = document.getElementById('requirements');

  const checkRequirements = () => {
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      different: currentPassword !== newPassword || currentPassword === '',
      match: newPassword === confirmPassword && newPassword !== '',
    };

    // Update requirement indicators
    Object.entries(checks).forEach(([requirement, isMet]) => {
      const requirementElement = requirements.querySelector(
        `[data-requirement="${requirement}"]`
      );
      if (requirementElement) {
        const icon = requirementElement.querySelector('svg');
        const text = requirementElement.querySelector('span');

        if (isMet) {
          if (icon) {
            icon.classList.remove('text-red-500');
            icon.classList.add('text-green-500');
            icon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        `;
          }
          if (text) {
            text.classList.remove('text-red-700');
            text.classList.add('text-green-700');
          }
        } else {
          if (icon) {
            icon.classList.remove('text-green-500');
            icon.classList.add('text-red-500');
            icon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        `;
          }
          if (text) {
            text.classList.remove('text-green-700');
            text.classList.add('text-red-700');
          }
        }
      }
    });

    // Enable/disable submit button
    const allRequirementsMet = Object.values(checks).every((check) => check);
    if (allRequirementsMet) {
      submitButton.disabled = false;
      submitButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
      submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    } else {
      submitButton.disabled = true;
      submitButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
      submitButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    }
  };

  // Toggle password visibility
  window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  // Add event listeners
  currentPasswordInput.addEventListener('input', checkRequirements);
  newPasswordInput.addEventListener('input', checkRequirements);
  confirmPasswordInput.addEventListener('input', checkRequirements);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Handle form submission here
    let oldPassword = currentPasswordInput.value;
    let newPassword = confirmPasswordInput.value;

    try {
      const response = await fetch('/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        displaySuccess('Password changed successfully.');

        // clearing fields after succesfully changed password
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';

        setTimeout(() => {
          window.location.href = '/account/change-password';
        }, 5000);
      } else {
        displayError(data.message);
      }
    } catch (error) {
      console.error({ Error: 'error while changing password (ajax)' });
    }
  });
});

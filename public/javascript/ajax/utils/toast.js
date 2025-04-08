// Store timeout IDs for each toast
const toastTimeouts = {};

function showToast(toastId, message) {
  const toast = document.getElementById(toastId);

  if (toast) {
    // Set the message dynamically
    const messageContainer = toast.querySelector('.ms-3.text-sm.font-normal');
    if (messageContainer) {
      messageContainer.textContent = message;
    }

    // Clear any existing timeout for this toast
    if (toastTimeouts[toastId]) {
      clearTimeout(toastTimeouts[toastId]);
    }

    // Show the toast
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    // Set a new timeout to hide the toast after 3 seconds
    toastTimeouts[toastId] = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
      delete toastTimeouts[toastId]; // Clean up the timeout ID
    }, 3000);
  }
}

// Optional: attach close buttons manually
document.querySelectorAll('[data-dismiss-target]').forEach((btn) => {
  btn.addEventListener('click', function () {
    const targetId = btn.getAttribute('data-dismiss-target');
    const toast = document.querySelector(targetId);

    if (toast) {
      toast.classList.add('hidden');
      toast.classList.remove('flex');

      // Clear any existing timeout for this toast
      if (toastTimeouts[targetId]) {
        clearTimeout(toastTimeouts[targetId]);
        delete toastTimeouts[targetId];
      }
    }
  });
});

export { showToast };

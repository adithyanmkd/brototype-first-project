const errorModal = document.getElementById('errorModal');
const backendErrorText = document.getElementById('backendErrorText');
const categoryForm = document.querySelector('#categoryFormElement');
// const categoryImageInput = document.getElementById('categoryImageInput');

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

// hide error message
function hideError() {
  let errorBox = document.querySelector('#error-box');
  errorBox.classList.add('hidden');
}

// show modal with message
function showErrorModal(message) {
  backendErrorText.textContent = message;
  errorModal.classList.remove('hidden');
  setTimeout(() => {
    errorModal.classList.add('hidden');
  }, 5000);
}

// hide modal
function hideErrorModal() {
  errorModal.classList.add('hidden');
}

// handle files and show preview
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('imagePreview').src = e.target.result;
      document
        .getElementById('imagePreviewContainer')
        .classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

// remove added image
// function removeImage() {
//   document.getElementById('imagePreviewContainer').classList.add('hidden');
//   document.getElementById('categoryImageInput').value = '';
// }

let blobImage = null;

function saveImage() {
  // Get cropped image as blob
  cropper.getCroppedCanvas().toBlob(async (blob) => {
    if (blob) {
      const thumbnailContainer = document.getElementById('imageThumbnail');
      thumbnailContainer.innerHTML = ''; // Clear existing thumbnail

      thumbnailContainer.classList.remove('hidden');
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.classList.add(
        'h-full',
        'w-full',
        'object-cover',
        'rounded-lg',
        'border',
        'border-gray-300'
      );

      thumbnailContainer.appendChild(img);
      document.getElementById('imagePreviewContainer').classList.add('hidden');
      blobImage = blob;
    }
  });
}

// let cropper;

// categoryImageInput.addEventListener('change', (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = document.getElementById('imagePreview');
//       img.src = event.target.result;

//       // Destroy old cropper instance (if exists)
//       if (cropper) cropper.destroy();

//       // Initialize new cropper instance
//       cropper = new Cropper(img, {
//         aspectRatio: 1,
//         viewMode: 2,
//         autoCropArea: 1,
//         movable: true,
//         scalable: true,
//         zoomable: true,
//       });
//       document
//         .getElementById('imagePreviewContainer')
//         .classList.remove('hidden');
//     };
//     reader.readAsDataURL(file);
//   }
// });

// category form validation and send body data into server
categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(categoryForm);

  const categoryName = formData.get('categoryName').trim();
  const description = formData.get('description').trim();
  // const categoryImageInput = categoryForm.querySelector('#categoryImageInput');

  if (!categoryName && !description) {
    displayError('All fields are required');
    return;
  } else if (!categoryName) {
    displayError('Please enter category name');
    return;
  } else if (!description) {
    displayError('Please enter description');
    return;
  }

  // hide error box after successful validation
  hideError();

  // formData.append('categoryImageInput', categoryImageInput[0]);
  try {
    const response = await fetch('/admin/categories/add', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('successfully added images into backend');
      window.location.href = '/admin/categories';
    } else {
      displayError(data.error);
    }
  } catch (error) {
    console.log('error in ajax form submit');
  }
});

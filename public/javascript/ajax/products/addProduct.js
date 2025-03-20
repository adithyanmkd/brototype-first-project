// Handle card image upload preview
document
  .getElementById('cardImageUpload')
  .addEventListener('change', (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('cardImageContainer').innerHTML = `
        <img src="${e.target.result}" class="h-full w-full object-cover rounded-t-4xl border border-[#D8DEE6]" />
        <button onclick="clearCardImage()" class="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">✕</button>
      `;
      };
      reader.readAsDataURL(file);
    }
  });

// Clear card image
// function clearCardImage() {
//     document.getElementById('cardImageUpload').value = '';
//     document.getElementById('cardImageContainer').innerHTML = `
//     <img src="/images/icons/img-placeholder.svg" alt="img placeholder" />
//     <p class="text-sm font-medium text-[#81909F]">Add a card image</p>
//   `;
// }

const container = document.getElementById('productThumbnails');
const fileInput = document.getElementById('productImagesUpload');
const uploadedFiles = [];

// Handle product image uploads
document
  .getElementById('productImagesUpload')
  .addEventListener('change', (event) => {
    event.preventDefault();
    Array.from(event.target.files).forEach((file) => {
      if (uploadedFiles.length < 6) {
        // Limit the number of uploaded images if needed
        uploadedFiles.push(file);
        const reader = new FileReader();

        reader.onload = (e) => {
          const imgWrapper = document.createElement('div');
          imgWrapper.classList.add(
            'relative',
            'h-[178px]',
            'w-[146px]',
            'rounded-[10px]',
            'border',
            'border-[#D8DEE6]'
          );

          imgWrapper.innerHTML = `
                    <img src="${e.target.result}" class="h-full rounded-[10px] w-full object-cover" />
                    <button onclick="removeImage(${uploadedFiles.length - 1})"
                        class="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                        ✕
                    </button>
                `;
          container.appendChild(imgWrapper);
        };

        reader.readAsDataURL(file);
      } else {
        alert('You can upload a maximum of 6 images.');
      }
    });
  });

// Remove image from the array and DOM
function removeImage(index) {
  uploadedFiles.splice(index, 1);
}

// Handle form submission using AJAX
document
  .getElementById('productForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch('/admin/products/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Product added successfully!');
        window.location.href = '/admin/products';
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

// import APIs
import adminProductAPIs from '../api/adminProductAPI.js';
import adminProductHandler from '../handlers/adminProductHandler.js';

let submitBtn = document.querySelector('#submit-btn');

let cardUploadDiv = document.querySelector('#card-upload-div');
let productImgsUploadDiv = document.querySelector('#product-imgs-upload-div');
const productsPreviewArea = document.getElementById('previewArea');

let cardInput = document.querySelector('#card-input');
let productImgsInput = document.querySelector('#product-imgs-input');

let cardImgDiv = document.querySelector('#card-img-div');
let cardImgPreview = document.querySelector('#card-img-preview');
let removeCardImgBtn = document.querySelector('#remove-card-img');

let cropImgPreview = document.querySelector('#crop-img-preview');
let cropModal = document.querySelector('#crop-modal');
let cropConfirmBtn = document.querySelector('#crop-confirm-btn');

let cropper = null;
let croppedImages = [];
let croppedCardImage = [];
let files = [];

let isProductsUploading = false;
let currentUploadType = '';

// input file listening and show the crop modal
cardInput.addEventListener('change', (e) => {
  currentUploadType = 'card';

  let file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      let originalImage = evt.target.result;

      cropModal.classList.remove('hidden');
      cropImgPreview.src = originalImage;

      if (cropper) cropper.destroy();

      cropImgPreview.onload = () => {
        cropper = new Cropper(cropImgPreview, {
          aspectRatio: 1,
          viewMode: 1,
        });
      };
    };

    reader.readAsDataURL(file);
  }
});

// remove card image
removeCardImgBtn.addEventListener('click', () => {
  cardImgPreview.src = '';
  cardInput.value = '';
  cardUploadDiv.classList.remove('hidden');
  cardImgDiv.classList.add('hidden');
});

// ================ products crop and upload logic ==========
productImgsUploadDiv.addEventListener('change', (e) => {
  currentUploadType = 'product';
  isProductsUploading = true;
  files = Array.from(e.target.files);
  handleNextFile(files);
});

function handleNextFile(files) {
  if (files.length === 0) return;
  let currentFile = files.shift();
  const reader = new FileReader();
  reader.onload = (event) => {
    let originalImage = event.target.result;
    cropModal.classList.remove('hidden');
    cropImgPreview.src = originalImage;

    if (cropper) cropper.destroy();

    cropper = new Cropper(cropImgPreview, {
      aspectRatio: 1,
      viewMode: 1,
    });
  };
  reader.readAsDataURL(currentFile);
}

// Unified crop confirm button logic
cropConfirmBtn.addEventListener('click', () => {
  if (!cropper) return;

  if (currentUploadType === 'card') {
    const canvas = cropper.getCroppedCanvas({});
    if (!canvas) {
      alert('Cropping failed! Please try again.');
      return;
    }
    const croppedImg = canvas.toDataURL('image/png');

    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Image processing failed!');
        return;
      }

      let previewUrl = URL.createObjectURL(blob);
      cardImgPreview.src = previewUrl;
      croppedCardImage.push(blob);
    });

    cropModal.classList.add('hidden');
    cardImgDiv.classList.remove('hidden');
    cardUploadDiv.classList.add('hidden');
    cropper.destroy();
    cropper = null;
  } else if (currentUploadType === 'product') {
    const canvas = cropper.getCroppedCanvas({});
    canvas.toBlob((blob) => {
      const previewUrl = URL.createObjectURL(blob);

      const div = document.createElement('div');
      div.className = 'relative inline-block mr-2 mb-2';

      const closeIconImg = document.createElement('img');
      closeIconImg.src = '/images/icons/round-close.svg';
      closeIconImg.className = 'absolute top-1 right-1 cursor-pointer z-10';

      const img = document.createElement('img');
      img.src = previewUrl;
      img.className = 'w-24 h-24 object-cover border rounded-[8px]';

      // Add remove functionality
      closeIconImg.addEventListener('click', () => {
        const index = croppedImages.indexOf(blob);
        if (index > -1) {
          croppedImages.splice(index, 1); // remove from array
        }
        div.remove(); // remove from DOM
      });

      div.append(closeIconImg, img);
      productsPreviewArea.appendChild(div);

      croppedImages.push(blob);

      cropModal.classList.add('hidden');
      productImgsInput.value = '';

      cropper.destroy();
      cropper = null;

      handleNextFile(files);
    });
  }
});

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  let productName = document.querySelector('#productName').value.trim();
  let description = document.querySelector('#description').value.trim();
  let sellingPrice = document.querySelector('#sellingPrice').value.trim();
  let originalPrice = document.querySelector('#originalPrice').value.trim();
  let category = document.querySelector("[name='category']").value;
  let quantity = document.querySelector("[name='quantity']").value.trim();

  // Input validations
  if (
    !productName ||
    !description ||
    !sellingPrice ||
    !originalPrice ||
    !quantity ||
    !category
  ) {
    alert('Please fill out all the fields.');
    return;
  }

  if (isNaN(sellingPrice) || isNaN(originalPrice)) {
    alert('Prices must be valid numbers.');
    return;
  }

  if (parseFloat(originalPrice) < parseFloat(sellingPrice)) {
    alert('Original price must not be less than the selling price.');
    return;
  }

  if (croppedImages.length === 0) {
    alert('Please upload at least one product image.');
    return;
  }

  if (croppedCardImage.length === 0) {
    alert('Please upload a card image.');
    return;
  }

  let formData = new FormData();

  formData.append('productName', productName);
  formData.append('description', description);
  formData.append('sellingPrice', sellingPrice);
  formData.append('originalPrice', originalPrice);
  formData.append('category', category);
  formData.append('quantity', quantity);

  croppedImages.forEach((productBlob, index) => {
    formData.append('productImages', productBlob, `image${index}.png`);
  });

  if (croppedCardImage.length > 0) {
    formData.append('cardImage', croppedCardImage[0], 'cardImage.png');
  }

  // add product handling
  await adminProductHandler.processAddProduct({ formData });
});

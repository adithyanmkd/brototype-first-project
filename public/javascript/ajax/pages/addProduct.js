// import utils
import validations from '../../utils/validators/validations.js';

// import handler
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

// sweat alert component for reusing
const showAlert = (title, text, icon = 'warning') => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
  });
};

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  let productName = document.querySelector('#productName').value.trim();
  let description = document.querySelector('#description').value.trim();
  let sellingPrice = document.querySelector('#sellingPrice').value.trim();
  let originalPrice = document.querySelector('#originalPrice').value.trim();
  let category = document.querySelector("[name='category']").value;
  let quantity = document.querySelector("[name='quantity']").value.trim();

  // converting string into number
  sellingPrice = Number(sellingPrice);
  originalPrice = Number(originalPrice);

  if (!validations.isValidName({ name: productName })) return; // product name validation

  if (!validations.isValidDescription({ description })) return; // description validation

  if (!validations.isValidPrice({ price: sellingPrice, priceType: 'selling' }))
    return; // selling price validation

  if (
    !validations.isValidPrice({ price: originalPrice, priceType: 'original' })
  )
    return; // original price validation

  if (sellingPrice > originalPrice) {
    return showAlert(
      'Price Error',
      'Selling price cannot be greater than the original price.',
      'error'
    );
  }

  if (!validations.isValidQuantity({ quantity })) return; // quantity validation

  // category validation
  if (!category)
    return showAlert('Missing Field', 'Please select category.', 'error');

  // image validation
  if (croppedImages.length === 0)
    return showAlert('Missing Image', 'Please upload images.', 'error');

  if (croppedImages.length < 3) {
    return showAlert(
      'Missing Image',
      'Please upload at least 3 product image.',
      'error'
    );
  }

  if (croppedImages.length > 6) {
    return showAlert(
      'Too Many Images',
      'You can upload a maximum of 6 product images.',
      'error'
    );
  }

  if (croppedCardImage.length === 0)
    return showAlert('Missing Image', 'Please upload a card image.', 'error');

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

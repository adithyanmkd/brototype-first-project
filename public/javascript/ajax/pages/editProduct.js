import adminProductHandler from '../handlers/adminProductHandler.js';

const submitBtn = document.querySelector('#submit-btn');
const cardUploadDiv = document.querySelector('#card-upload-div');
const productImgsUploadDiv = document.querySelector('#product-imgs-upload-div');
const productsPreviewArea = document.getElementById('previewArea');

const cardInput = document.querySelector('#card-input');
const productImgsInput = document.querySelector('#product-imgs-input');

const cardImgDiv = document.querySelector('#card-img-div');
const cardImgPreview = document.querySelector('#card-img-preview');
const removeCardImgBtn = document.querySelector('#remove-card-img');

const cropImgPreview = document.querySelector('#crop-img-preview');
const cropModal = document.querySelector('#crop-modal');
const cropConfirmBtn = document.querySelector('#crop-confirm-btn');

let cropper = null;
let croppedImages = [];
let croppedCardImage = [];
let files = [];

let currentUploadType = '';
let removedImageIds = [];

let productId = null;
let isProductsUploading = false;

// ======== Load Existing Product ========
async function loadProductData() {
  productId = getProductIdFromURL();

  const res = await fetch(`/admin/products/get/${productId}`);
  const converted = await res.json();

  let product = converted.product;

  // console.log('Converted log: ', converted);

  // Fill form fields
  document.querySelector('#productName').value = product.productName;
  document.querySelector('#description').value = product.description;
  document.querySelector('#sellingPrice').value = product.price.sellingPrice;
  document.querySelector('#originalPrice').value = product.price.originalPrice;
  document.querySelector("[name='category']").value = product.category._id;
  document.querySelector("[name='quantity']").value = product.quantity;

  // Render existing card image
  if (product.images.cardImage) {
    cardImgDiv.classList.remove('hidden');
    cardUploadDiv.classList.add('hidden');
    cardImgPreview.src = product.images.cardImage.path;
    cardImgPreview.dataset.imageId = product.images.cardImage._id;
  }

  // Render existing product images
  product.images.productImages.forEach((img) => {
    const div = document.createElement('div');
    div.className = 'relative inline-block mr-2 mb-2';

    const closeIconImg = document.createElement('img');
    closeIconImg.src = '/images/icons/round-close.svg';
    closeIconImg.className = 'absolute top-1 right-1 cursor-pointer z-10';

    const imageEl = document.createElement('img');
    imageEl.src = img.path;
    imageEl.className = 'w-24 h-24 object-cover border rounded-[8px]';

    closeIconImg.addEventListener('click', () => {
      console.log(img._id, 'product id');
      console.log(removedImageIds, 'removed ids');
      removedImageIds.push(img._id);
      div.remove();
    });

    div.append(closeIconImg, imageEl);
    productsPreviewArea.appendChild(div);
  });
}

function getProductIdFromURL() {
  const url = new URL(window.location.href);
  let splittedUrl = url.pathname.split('/');
  let productId = splittedUrl.pop();
  return productId;
}

// ========== Cropper Logic ==========
cardInput.addEventListener('change', (e) => {
  currentUploadType = 'card';
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      cropModal.classList.remove('hidden');
      cropImgPreview.src = evt.target.result;

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

removeCardImgBtn.addEventListener('click', () => {
  const imgId = cardImgPreview.dataset.imageId;
  if (imgId) removedImageIds.push(imgId);

  cardImgPreview.src = '';
  cardInput.value = '';
  cardUploadDiv.classList.remove('hidden');
  cardImgDiv.classList.add('hidden');
});

productImgsUploadDiv.addEventListener('change', (e) => {
  currentUploadType = 'product';
  isProductsUploading = true;
  files = Array.from(e.target.files);
  handleNextFile(files);
});

function handleNextFile(files) {
  if (files.length === 0) return;
  const currentFile = files.shift();
  const reader = new FileReader();
  reader.onload = (event) => {
    cropModal.classList.remove('hidden');
    cropImgPreview.src = event.target.result;

    if (cropper) cropper.destroy();
    cropper = new Cropper(cropImgPreview, {
      aspectRatio: 1,
      viewMode: 1,
    });
  };
  reader.readAsDataURL(currentFile);
}

cropConfirmBtn.addEventListener('click', () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({});
  if (!canvas) {
    alert('Cropping failed!');
    return;
  }

  canvas.toBlob((blob) => {
    if (!blob) return;

    const previewUrl = URL.createObjectURL(blob);

    if (currentUploadType === 'card') {
      cardImgPreview.src = previewUrl;
      croppedCardImage = [blob];
      cropModal.classList.add('hidden');
      cardImgDiv.classList.remove('hidden');
      cardUploadDiv.classList.add('hidden');
    } else {
      const div = document.createElement('div');
      div.className = 'relative inline-block mr-2 mb-2';

      const closeIconImg = document.createElement('img');
      closeIconImg.src = '/images/icons/round-close.svg';
      closeIconImg.className = 'absolute top-1 right-1 cursor-pointer z-10';

      const img = document.createElement('img');
      img.src = previewUrl;
      img.className = 'w-24 h-24 object-cover border rounded-[8px]';

      closeIconImg.addEventListener('click', () => {
        const index = croppedImages.indexOf(blob);
        if (index > -1) {
          croppedImages.splice(index, 1);
        }
        div.remove();
      });

      div.append(closeIconImg, img);
      productsPreviewArea.appendChild(div);
      croppedImages.push(blob);
      productImgsInput.value = '';
      handleNextFile(files);
    }

    cropModal.classList.add('hidden');
    cropper.destroy();
    cropper = null;
  });
});

// ========== Submit Updated Product ==========
submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const productName = document.querySelector('#productName').value.trim();
  const description = document.querySelector('#description').value.trim();
  const sellingPrice = document.querySelector('#sellingPrice').value.trim();
  const originalPrice = document.querySelector('#originalPrice').value.trim();
  const category = document.querySelector("[name='category']").value;
  const quantity = document.querySelector("[name='quantity']").value.trim();

  if (
    !productName ||
    !description ||
    !sellingPrice ||
    !originalPrice ||
    !quantity ||
    !category
  ) {
    alert('Please fill all fields.');
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

  const formData = new FormData();

  formData.append('productId', productId);
  formData.append('productName', productName);
  formData.append('description', description);
  formData.append('sellingPrice', sellingPrice);
  formData.append('originalPrice', originalPrice);
  formData.append('category', category);
  formData.append('quantity', quantity);

  croppedImages.forEach((blob, index) => {
    formData.append('productImages', blob, `product${index}.png`);
  });

  if (croppedCardImage.length > 0) {
    formData.append('cardImage', croppedCardImage[0], 'cardImage.png');
  }

  removedImageIds.forEach((id) => {
    formData.append('removedImageIds[]', id);
  });

  await adminProductHandler.processEditProduct({ formData, productId });
});

// Load product when page loads
window.addEventListener('DOMContentLoaded', loadProductData);

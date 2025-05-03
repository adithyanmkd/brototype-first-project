let cardUploadDiv = document.querySelector('#card-upload-div');
let cardInput = document.querySelector('#card-input');

let cardImgDiv = document.querySelector('#card-img-div');
let cardImgPreview = document.querySelector('#card-img-preview');
let removeCardImgBtn = document.querySelector('#remove-card-img');

let cropImgPrview = document.querySelector('#crop-img-preview');
let cropModal = document.querySelector('#crop-modal');
let cropConfirmBtn = document.querySelector('#crop-confirm-btn');

let cropper = null;

// input file listening and show the crop modal
cardInput.addEventListener('change', (e) => {
  let file = e.target.files[0];
  console.log(file);

  if (file) {
    const reader = new FileReader();

    reader.onload = (evt) => {
      let originalImage = evt.target.result;

      cropModal.classList.remove('hidden');
      cropImgPrview.src = originalImage;

      if (cropper) {
        cropper.destroy();
      }

      // Wait for the image to load before initializing Cropper
      cropImgPrview.onload = () => {
        cropper = new Cropper(cropImgPrview, {
          aspectRatio: 1,
          viewMode: 1,
          background: true,
          responsive: true,
          dragMode: 'move',
        });
      };
    };

    reader.readAsDataURL(file);
  }
});

// crop confirm btn and show the img preview
cropConfirmBtn.addEventListener('click', () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({});

  const croppedImg = canvas.toDataURL('image/png');

  cardImgPreview.src = croppedImg;

  // hide crop the modal and input field
  cropModal.classList.add('hidden');
  cardImgDiv.classList.remove('hidden');
  cardUploadDiv.classList.add('hidden');

  // Destroy the cropper to free memory
  cropper.destroy();
  cropper = null;
});

// remove card image
removeCardImgBtn.addEventListener('click', () => {
  cardImgPreview.src = '';
  cardInput.value = '';

  // toggle
  cardUploadDiv.classList.remove('hidden');
  cardImgDiv.classList.add('hidden');
});

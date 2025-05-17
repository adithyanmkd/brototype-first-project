// import handler funcitons
import {
  handleWishlistDelete,
  handleWishlistToCart,
} from '../handlers/wishlistHandler.js';

document.addEventListener('DOMContentLoaded', scriptLoad);

function scriptLoad() {
  const delBtns = document.querySelectorAll('.deleteWishlist');
  const wishlistToCartForm = document.querySelectorAll('.wishlistToCartForm');

  delBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      let productId = btn.dataset.productId;
      // console.log('product id: ', productId);

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          handleWishlistDelete({ productId });
        }
      });
    });
  });

  wishlistToCartForm.forEach((form) => {
    form.addEventListener('submit', handleWishlistToCart);
  });
}

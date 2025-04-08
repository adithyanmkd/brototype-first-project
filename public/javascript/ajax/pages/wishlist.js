// import handler funcitons
import { handleWishlistDelete } from '../handlers/wishlistHandler.js';

document.addEventListener('DOMContentLoaded', scriptLoad);

function scriptLoad() {
  const delBtns = document.querySelectorAll('.deleteWishlist');

  delBtns.forEach((btn) => {
    btn.addEventListener('click', handleWishlistDelete);
  });
}

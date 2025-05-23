import { handleAddToWishlist } from '../handlers/userProductHandler.js';

const wishlistBtns = document.querySelectorAll('.wishlist-btn');
const searchForm = document.querySelector('#productSearch');
const searchInput = document.querySelector('#default-search');
const clearSearchBtn = document.querySelector('#clear-search');
const productGrid = document.querySelector('#product-grid');
const pagination = document.querySelector('#pagination');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
const noResults = document.querySelector('#no-results');

// Helper to show/hide elements
const setDisplay = (element, show) => {
  element.classList.toggle('hidden', !show);
};

// Helper to get URL parameters
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category') || 'all',
    sort: params.get('sort') || '',
    page: parseInt(params.get('page')) || 1,
    search: params.get('search') || '',
  };
};

// Update wishlist buttons after dynamic render
const updateWishlistListeners = () => {
  const newWishlistBtns = document.querySelectorAll('.wishlist-btn');
  newWishlistBtns.forEach((btn) => {
    // Remove existing listeners to prevent duplicates
    btn.removeEventListener('click', handleAddToWishlist);
    btn.addEventListener('click', handleAddToWishlist);
  });
};

// Render product grid
const renderProducts = (products, wishlistIds) => {
  setDisplay(productGrid, true);
  productGrid.innerHTML = products
    .map(
      (product) => `
        <a href="/products/${product._id}" class="block bg-white relative p-5 rounded-xl shadow-md hover:shadow-lg transition">
          <img src="${product.images.cardImage.path}" alt="${product.productName}" class="w-full h-64 object-cover rounded-lg" />
          <button class="wishlist-btn">
            <div class="${
              wishlistIds.includes(product._id.toString()) ? 'text-red-500' : ''
            } absolute top-8 right-8">
              <svg width="33" height="20" viewBox="0 0 33 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path data-product-id="${product._id}" d="M3.73799 16.5186L15.8114 27.9829C16.1374 28.2924 16.3004 28.4472 16.5 28.4472C16.6996 28.4472 16.8626 28.2924 17.1886 27.9829L29.262 16.5186C32.5238 13.4213 32.9209 8.36131 30.1821 4.7932L29.6132 4.05203C26.3131 -0.247499 19.6328 0.468379 17.3187 5.36956C16.9921 6.06127 16.0079 6.06127 15.6813 5.36956C13.3672 0.468379 6.68694 -0.247495 3.38678 4.05203L2.81788 4.7932C0.0791311 8.36131 0.476197 13.4213 3.73799 16.5186Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </button>
          ${renderCardTextBlock(product)}
        </a>
      `
    )
    .join('');
  updateWishlistListeners();
};

// Render cardTextBlock (client-side equivalent of cardTextBlock.ejs)
const renderCardTextBlock = (product) => {
  return `
    <div>
      <h3 class="pb-4 text-[20px] font-medium text-gray-800">${product.productName || 'Unnamed Product'}</h3>
      <div class="space-y-2">
        <div class="flex items-center text-sm text-yellow-500">
          <img src="/images/icons/stars.svg" alt="stars" />
          <span class="ml-1 text-gray-500">${product.quantity || 0}</span>
          <!-- TODO: Replace product.quantity with product.rating when rating feature is implemented -->
        </div>
        <p class="mt-1 text-[16px] max-h-[4.5rem] leading-[160%] overflow-hidden font-light text-gray-600">
          ${product.description || 'No description available'}
        </p>
        ${
          product.quantity
            ? `
              <div class="flex items-baseline space-x-4">
                <span class="text-2xl font-medium text-[#181818]">₹${product.price?.sellingPrice || 0}</span>
                <span class="text-lg text-gray-400 line-through">₹${product.price?.originalPrice || 0}</span>
                <p class="text-sm font-medium text-green-600">save ₹${(product.price?.originalPrice || 0) - (product.price?.sellingPrice || 0)}</p>
              </div>
            `
            : `
              <p class="bg-red-50 py-2 text-red-800 border text-center rounded-[8px] border-red-500 font-medium">Out of stock</p>
            `
        }
      </div>
    </div>
  `;
};

// Render pagination
const renderPagination = ({
  currentPage,
  totalPages,
  category,
  sort,
  search,
}) => {
  setDisplay(pagination, totalPages > 0);
  pagination.innerHTML = `
    ${
      currentPage > 1
        ? `<a href="/products?page=${currentPage - 1}&category=${category || ''}&sort=${sort || ''}&search=${search || ''}" class="bg-blue-500 text-white px-4 py-2 mx-2 rounded-md">Previous</a>`
        : ''
    }
    <span class="px-4 py-2 border rounded-md bg-gray-100">
      Page ${currentPage} of ${totalPages}
    </span>
    ${
      currentPage < totalPages
        ? `<a href="/products?page=${currentPage + 1}&category=${category || ''}&sort=${sort || ''}&search=${search || ''}" class="bg-blue-500 text-white px-4 py-2 mx-2 rounded-md">Next</a>`
        : ''
    }
  `;
};

// Handle search submission
const handleSearch = async (e) => {
  e.preventDefault();
  setDisplay(loading, true);
  setDisplay(error, false);
  setDisplay(noResults, false);
  setDisplay(productGrid, false);
  setDisplay(pagination, false);

  const searchValue = searchInput.value.trim();
  const { category, sort, page } = getQueryParams();

  try {
    const params = new URLSearchParams();
    params.set('page', page);
    if (category && category !== 'all') params.set('category', category);
    if (sort) params.set('sort', sort);
    if (searchValue) params.set('search', searchValue);

    const response = await fetch(`/products?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setDisplay(loading, false);
      if (data.products.length === 0) {
        setDisplay(noResults, true);
      } else {
        renderProducts(data.products, data.wishlistIds);
        renderPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          category,
          sort,
          search: searchValue,
        });
      }
      // Update URL
      history.pushState({}, '', `/products?${params.toString()}`);
      // Update clear button visibility
      setDisplay(clearSearchBtn, !!searchValue);
    } else {
      throw new Error(data.message || 'No products found');
    }
  } catch (err) {
    setDisplay(loading, false);
    setDisplay(error, true);
    error.textContent =
      err.message || 'Failed to load products. Please try again.';
  }
};

// Clear search
const clearSearch = () => {
  searchInput.value = '';
  setDisplay(clearSearchBtn, false);
  handleSearch({ preventDefault: () => {} });
};

// Initialize
wishlistBtns.forEach((btn) => {
  btn.addEventListener('click', handleAddToWishlist);
});

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
  clearSearchBtn.addEventListener('click', clearSearch);

  // Show clear button if search input has value
  searchInput.addEventListener('input', () => {
    setDisplay(clearSearchBtn, !!searchInput.value.trim());
  });
  setDisplay(clearSearchBtn, !!searchInput.value.trim());
}

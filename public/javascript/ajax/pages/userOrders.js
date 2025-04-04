let changeFilterBtn = document.querySelectorAll('.status-item'); // accessing filter value
let searchInput = document.getElementById('searchField'); // accessing search value

// search functionality
searchInput.addEventListener('keydown', searchOrder);
function searchOrder(e) {
  if (e.key == 'Enter') {
    let searchVal = e.target.value;
    window.location.href = `/account/orders?search=${searchVal}`;
  }
}

// filter functionality
changeFilterBtn.forEach((btn) => {
  btn.addEventListener('click', changeFilter);
});

function changeFilter(e) {
  let category = e.target.value;
  window.location.href = `/account/orders?category=${category}`;
}

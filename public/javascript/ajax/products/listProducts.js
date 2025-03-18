function openDeleteModal(productId) {
    const modal = document.getElementById('deleteModal');
    const deleteForm = document.getElementById('deleteForm');

    deleteForm.action = `/admin/products/${productId}/delete`;
    modal.classList.remove('hidden');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
}

// Search functionality
document.getElementById("search").addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        let productName = row.querySelector("td div p").textContent.toLowerCase();
        row.style.display = productName.includes(filter) ? "" : "none";
    });
});

// Clear search functionality
document.getElementById("clearSearch").addEventListener("click", function () {
    document.getElementById("search").value = "";
    document.querySelectorAll("#productTable tr").forEach(row => {
        row.style.display = "";
    });
});
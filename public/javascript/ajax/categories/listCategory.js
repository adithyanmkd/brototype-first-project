// Open Delete Modal
function openDeleteModal(categoryId) {
    const modal = document.getElementById('deleteModal');
    const deleteForm = document.getElementById('deleteForm');

    deleteForm.action = `/admin/categories/${categoryId}/delete`;
    modal.classList.add("flex")
    modal.classList.remove('hidden');
}

// Close Delete Modal
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
}
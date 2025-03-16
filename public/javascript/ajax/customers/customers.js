let currentUserId = null;
let isBlockAction = true;

function showModal(userId, isBlocked) {
    currentUserId = userId;
    isBlockAction = !isBlocked;

    const modal = document.getElementById('confirmationModal');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');

    title.textContent = isBlockAction ? 'Block User' : 'Unblock User';
    message.textContent = `Are you sure you want to ${isBlockAction ? 'block' : 'unblock'} this user?`;
    modal.classList.add("flex")
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('confirmationModal').classList.add('hidden');
    currentUserId = null;
}

async function confirmAction() {
    if (!currentUserId) return;

    try {
        const response = await fetch(`/admin/customers/${currentUserId}/toggle-block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.reload(); // Refresh to show updated status
        } else {
            alert('Action failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
    closeModal();
}
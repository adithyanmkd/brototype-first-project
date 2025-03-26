async function updateStatus(btnName, orderId) {
  try {
    const res = await fetch('/admin/orders/update-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ btnName, orderId }),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error('update failed');
    }

    return data;
  } catch (error) {
    console.error('Status update error', error);
    return { success: false };
  }
}

// export APIs
export { updateStatus };

// ordered items status changing
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

// api for descision handling (approve or reject for orders)
async function updateDescision(orderId, action) {
  try {
    const res = await fetch('/admin/orders/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action }),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error('update failed');
    }

    return data;
  } catch (error) {
    console.error('Descision update error', error);
    return { success: false };
  }
}

// export APIs
export { updateStatus, updateDescision };

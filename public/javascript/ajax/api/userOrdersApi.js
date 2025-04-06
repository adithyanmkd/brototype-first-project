async function returnOrderApi(orderId, response) {
  try {
    let res = await fetch('/account/orders/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, response }),
    });

    let data = res.json();

    if (!res.ok) {
      console.error('update failed');
      throw new Error('update failed');
    }
    return data;
  } catch (error) {
    console.error('Status update error', error);
    return { success: false };
  }
}

export { returnOrderApi };

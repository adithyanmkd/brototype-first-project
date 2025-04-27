async function processPayment(method) {
  try {
    const res = await fetch('/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method }),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Payment failed');
    }

    return data;
  } catch (error) {
    console.error('Payment Error: ', error);
    return { success: false, error };
  }
}

// export APIs
export { processPayment };

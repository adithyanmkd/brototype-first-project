// add coupon api
async function sendCouponToServer(formData) {
  try {
    let res = await fetch('/admin/coupons/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'coupon adding failed');
    }

    return data;
  } catch (error) {
    console.error('coupon adding error', error);
    return { success: false };
  }
}

// edit coupon api
async function sendEditCouponToServer(formData) {
  try {
    let res = await fetch(`/admin/coupons/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'coupon adding failed');
    }

    return data;
  } catch (error) {
    console.error('coupon adding error', error);
    return { success: false };
  }
}

// delete coupon
async function deleteCoupon(couponId) {
  try {
    let res = await fetch(`/admin/coupons/delete/${couponId}`, {
      method: 'DELETE',
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'coupon deleting failed');
    }

    return data;
  } catch (error) {
    console.error('coupon delete error', error);
    return { success: false };
  }
}

export { sendCouponToServer, sendEditCouponToServer, deleteCoupon };

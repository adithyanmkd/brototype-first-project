// import APIs
import {
  sendCouponToServer,
  sendEditCouponToServer,
} from '../api/adminCouponApi.js';

const processAddCoupon = async (data) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    endDate,
    isActive,
  } = data;

  const errors = [];

  if (!code || typeof code !== 'string' || code.trim() === '') {
    errors.push('Coupon code is required and must be a string.');
  } else if (/\s/.test(code)) {
    errors.push('Coupon code must not contain spaces.');
  }

  if (
    !discountType ||
    (discountType !== 'percentage' && discountType !== 'fixed')
  ) {
    errors.push('Discount type must be either "percentage" or "fixed".');
  }

  if (isNaN(discountValue) || discountValue <= 0) {
    errors.push('Discount value must be a positive number.');
  } else if (discountType === 'percentage' && discountValue > 100) {
    errors.push('Percentage discount value cannot exceed 100%.');
  }

  if (isNaN(minOrderAmount) || minOrderAmount < 0) {
    errors.push('Minimum order amount must be a non-negative number.');
  }

  if (!startDate || !endDate) {
    errors.push('Start and end dates must be provided.');
  } else if (new Date(startDate) > new Date(endDate)) {
    errors.push('Start date must be before end date.');
  }

  const now = new Date();
  if (new Date(startDate) < now.setHours(0, 0, 0, 0)) {
    errors.push('Start date cannot be in the past.');
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }

  console.log('Coupon data is valid:', data);
  try {
    let response = await sendCouponToServer(data);

    if (!response.success) {
      alert(response.message || 'Coupon adding failed');
      return;
    }

    window.location.href = '/admin/coupons';
  } catch (error) {
    console.error('Coupon submission error:', error);
    alert('An unexpected error occurred.');
  }
};

const processEditCoupon = async (data) => {
  const {
    couponId,
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    endDate,
    isActive,
  } = data;

  const errors = [];

  // // Validate ID (ensuring it is a string and is present)
  // if (!couponId || typeof couponId !== 'string') {
  //   errors.push('Coupon ID is required.');
  // }

  // Validate coupon code
  if (!code || typeof code !== 'string' || code.trim() === '') {
    errors.push('Coupon code is required and must be a string.');
  } else if (/\s/.test(code)) {
    errors.push('Coupon code must not contain spaces.');
  }

  // Validate discount type
  if (
    !discountType ||
    (discountType !== 'percentage' && discountType !== 'fixed')
  ) {
    errors.push('Discount type must be either "percentage" or "fixed".');
  }

  // Validate discount value
  if (isNaN(discountValue) || discountValue <= 0) {
    errors.push('Discount value must be a positive number.');
  } else if (discountType === 'percentage' && discountValue > 100) {
    errors.push('Percentage discount value cannot exceed 100%.');
  }

  // Validate minimum order amount
  if (isNaN(minOrderAmount) || minOrderAmount < 0) {
    errors.push('Minimum order amount must be a non-negative number.');
  }

  // Validate dates
  if (!startDate || !endDate) {
    errors.push('Start and end dates must be provided.');
  } else if (new Date(startDate) > new Date(endDate)) {
    errors.push('Start date must be before end date.');
  }

  // Ensure the start date is not in the past
  const now = new Date();
  if (new Date(startDate) < now.setHours(0, 0, 0, 0)) {
    errors.push('Start date cannot be in the past.');
  }

  // If there are errors, alert and stop the function
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }

  // Log the valid data (for debugging purposes)
  console.log('Coupon data is valid:', data);

  try {
    // Call the API to update the coupon on the server
    const response = await sendEditCouponToServer(data);

    // Handle the response from the server
    if (!response.success) {
      alert(response.message || 'Coupon editing failed');
      return;
    }

    // Redirect to the coupon listing page after successful update
    window.location.href = '/admin/coupons';
  } catch (error) {
    console.error('Coupon update error:', error);
    alert('An unexpected error occurred while updating the coupon.');
  }
};

export { processAddCoupon, processEditCoupon };

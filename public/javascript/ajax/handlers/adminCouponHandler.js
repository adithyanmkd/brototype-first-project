// import APIs
import {
  sendCouponToServer,
  sendEditCouponToServer,
  deleteCoupon,
} from '../api/adminCouponApi.js';

// add coupon
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
  } else if (discountType === 'percentage' && discountValue > 40) {
    errors.push('Percentage discount value cannot exceed 40%.');
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
    return { success: false, message: errors.join('\n') };
  }

  // console.log('Coupon data is valid:', data);
  try {
    let response = await sendCouponToServer(data);

    if (!response.success) {
      console.log('response msg', response);
      return {
        success: false,
        message: response.message || 'Coupon adding failed',
      };
    }

    return { success: true, redirect: '/admin/coupons' };
  } catch (error) {
    console.error('Coupon submission error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
};

// edit coupon
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

  // Validate ID (ensuring it is a string and is present)
  if (!couponId || typeof couponId !== 'string') {
    errors.push('Coupon ID is required.');
  }

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
  } else if (discountType === 'percentage' && discountValue > 40) {
    errors.push('Percentage discount value cannot exceed 40%.');
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

  if (errors.length > 0) {
    return { success: false, message: errors.join('\n') };
  }

  console.log('Coupon data is valid:', data);

  try {
    const response = await sendEditCouponToServer(data);

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Coupon editing failed',
      };
    }

    return { success: true, redirect: '/admin/coupons' };
  } catch (error) {
    console.error('Coupon update error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while updating the coupon.',
    };
  }
};

// delete coupon
const processdeleteCoupon = async (couponId) => {
  try {
    const response = await deleteCoupon(couponId);

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Coupon delete failed',
      };
    }

    return { success: true, redirect: response.redirect || '/admin/coupons' };
  } catch (error) {
    console.error('Coupon deletion error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while deleting the coupon.',
    };
  }
};

export { processAddCoupon, processEditCoupon, processdeleteCoupon };

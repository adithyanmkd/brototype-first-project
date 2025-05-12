import {
  processAddCoupon,
  processEditCoupon,
  processdeleteCoupon,
} from '../handlers/adminCouponHandler.js';

document.addEventListener('DOMContentLoaded', loadScript);

function loadScript() {
  const couponAddForm = document.querySelector('#couponAddForm');
  const couponEditForm = document.querySelector('#couponEditForm');
  const delBtns = document.querySelectorAll('.coupon-del-btn');

  // Coupon creation form
  if (couponAddForm) {
    couponAddForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission

      try {
        // Access form values
        const code = couponAddForm.querySelector('#code')?.value.trim();
        const discountType =
          couponAddForm.querySelector('#discountType')?.value;
        const discountValue = parseFloat(
          couponAddForm.querySelector('#discountValue')?.value
        );
        const minOrderAmount = parseFloat(
          couponAddForm.querySelector('#minOrderAmount')?.value
        );
        const maxDiscountAmount = parseFloat(
          couponAddForm.querySelector('#maxDiscountAmount')?.value || 0
        );
        const startDate = couponAddForm.querySelector('#startDate')?.value;
        const endDate = couponAddForm.querySelector('#endDate')?.value;
        const isActive = couponAddForm.querySelector('#isActive')?.checked;

        // Validate required fields
        if (
          !code ||
          !discountType ||
          !discountValue ||
          !startDate ||
          !endDate
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all required fields.',
          });
          return;
        }

        // Validate date range
        if (new Date(endDate) < new Date(startDate)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Date Range',
            text: 'End date must be after start date.',
          });
          return;
        }

        const couponData = {
          code,
          discountType,
          discountValue,
          minOrderAmount,
          maxDiscountAmount: maxDiscountAmount || null,
          startDate,
          endDate,
          isActive,
        };

        // Add loading state
        const submitBtn = couponAddForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-3"></i> Creating...';

        // Process coupon creation
        const response = await processAddCoupon(couponData);

        // Check response for success
        if (response && response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Coupon Created',
            text: 'The coupon has been successfully created!',
            showConfirmButton: false,
            timer: 1500,
          });

          setTimeout(() => {
            window.location.href = '/admin/coupons';
          }, 1600);
        } else {
          throw new Error(response?.message || 'Failed to create coupon');
        }
      } catch (error) {
        // Log detailed error information
        console.error('Error creating coupon:', {
          message: error.message,
          stack: error.stack,
          response: error.response || 'No response data',
        });

        Swal.fire({
          icon: 'error',
          title: 'Error Creating Coupon',
          text:
            error.message || 'An unexpected error occurred. Please try again.',
        });
      } finally {
        // Reset button state
        const submitBtn = couponAddForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save mr-3 text-lg"></i> Create Coupon';
      }
    });
  }

  // Coupon edit form
  if (couponEditForm) {
    couponEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const couponId = couponEditForm.querySelector('#couponId')?.value;

        const code = couponEditForm.querySelector('#code')?.value.trim();
        const discountType =
          couponEditForm.querySelector('#discountType')?.value;
        const discountValue = parseFloat(
          couponEditForm.querySelector('#discountValue')?.value
        );
        console.log(discountValue, 'field log');
        const minOrderAmount = parseFloat(
          couponEditForm.querySelector('#minOrderAmount')?.value
        );
        const maxDiscountAmount = parseFloat(
          couponEditForm.querySelector('#maxDiscountAmount')?.value || 0
        );
        const startDate = couponEditForm.querySelector('#startDate')?.value;
        const endDate = couponEditForm.querySelector('#endDate')?.value;
        const isActive = couponEditForm.querySelector('#isActive')?.checked;

        if (
          !couponId ||
          !code ||
          !discountType ||
          !discountValue ||
          !startDate ||
          !endDate
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all required fields.',
          });
          return;
        }

        if (new Date(endDate) < new Date(startDate)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Date Range',
            text: 'End date must be after start date.',
          });
          return;
        }

        const couponData = {
          couponId,
          code,
          discountType,
          discountValue,
          minOrderAmount,
          maxDiscountAmount: maxDiscountAmount || null,
          startDate,
          endDate,
          isActive,
        };

        const submitBtn = couponEditForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-3"></i> Updating...';

        const response = await processEditCoupon(couponData);

        if (response && response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Coupon Updated',
            text: 'The coupon has been successfully updated!',
            showConfirmButton: false,
            timer: 1500,
          });

          setTimeout(() => {
            window.location.href = '/admin/coupons';
          }, 1700);

          // if (window.Alpine) {
          //   Alpine.store('adminLayout').couponEdit.open = false;
          // }
        } else {
          throw new Error(response?.message || 'Failed to update coupon');
        }
      } catch (error) {
        console.error('Error updating coupon:', {
          message: error.message,
          stack: error.stack,
          response: error.response || 'No response data',
        });

        Swal.fire({
          icon: 'error',
          title: 'Error Updating Coupon',
          text:
            error.message || 'An unexpected error occurred. Please try again.',
        });
      } finally {
        const submitBtn = couponEditForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save mr-3"></i> Update Coupon';
      }
    });
  }

  // Coupon deletion
  delBtns.forEach(async (btn) => {
    btn.addEventListener('click', async () => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
      if (result.isConfirmed) {
        await processdeleteCoupon(btn.dataset.couponId);
      }
    });
  });
}

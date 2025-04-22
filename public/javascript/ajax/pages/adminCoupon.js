import {
  processAddCoupon,
  processEditCoupon,
  processdeleteCoupon,
} from '../handlers/adminCouponHandler.js';

document.addEventListener('DOMContentLoaded', loadScript);

function loadScript() {
  let couponAddForm = document.querySelector('#couponAddForm');
  let couponEditForm = document.querySelector('#couponEditForm');
  let delBtns = document.querySelectorAll('.coupon-del-btn');

  if (!couponAddForm) return;

  // coupon creating
  couponAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // accessing form values
    const code = couponAddForm.querySelector('#code').value.trim();
    const discountType = couponAddForm.querySelector('#discountType').value;
    const discountValue = parseFloat(
      couponAddForm.querySelector('#discountValue').value
    );
    const minOrderAmount = parseFloat(
      couponAddForm.querySelector('#minOrderAmount').value
    );
    const maxDiscountAmount = parseFloat(
      couponAddForm.querySelector('#maxDiscountAmount').value
    );
    const startDate = couponAddForm.querySelector(
      '#datepicker-range-start'
    ).value;
    const endDate = couponAddForm.querySelector('#datepicker-range-end').value;
    const isActive = couponAddForm.querySelector('#isActive').checked;

    const couponData = {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      isActive,
    };

    // form values pass into handler
    await processAddCoupon(couponData);
  });

  // edit form
  if (couponEditForm) {
    couponEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const couponId = couponEditForm.querySelector('#couponId').value;
      const code = couponEditForm.querySelector('#code').value.trim();

      const discountType = couponEditForm.querySelector('#discountType').value;

      const discountValue = parseFloat(
        couponEditForm.querySelector('#discountValue').value
      );

      const minOrderAmount = parseFloat(
        couponEditForm.querySelector('#minOrderAmount').value
      );

      const maxDiscountAmount = parseFloat(
        couponEditForm.querySelector('#maxDiscountAmount').value
      );

      const startDate = couponEditForm.querySelector('#startDate').value;

      const endDate = couponEditForm.querySelector('#endDate').value;

      const isActive = couponEditForm.querySelector('#isActive').checked;

      const couponData = {
        couponId,
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        isActive,
      };

      await processEditCoupon(couponData);
    });
  }

  // coupon deleting
  delBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let confirm = document.querySelector('#confirm');

      confirm.addEventListener('click', async () => {
        await processdeleteCoupon(btn.dataset.couponId);
      });
    });
  });
}

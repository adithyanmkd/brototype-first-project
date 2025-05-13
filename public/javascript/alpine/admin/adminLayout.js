// adminAlpine.js
document.addEventListener('alpine:init', () => {
  Alpine.data('adminLayout', () => ({
    currentCoupon: [],
    couponAdd: { open: false },
    couponEdit: { open: false },

    // confirm modal state
    confirmModal: { open: false },

    // Method to open the add modal
    openAddModal() {
      this.couponAdd.open = true;
    },

    // Method to close the add modal
    closeAddModal() {
      this.couponAdd.open = false;
    },

    // Method to open the edit modal
    openEditModal(coupon) {
      this.currentCoupon = coupon;

      // Format startDate and endDate to YYYY-MM-DD for <input type="date">
      if (this.currentCoupon.startDate) {
        this.currentCoupon.startDate = new Date(this.currentCoupon.startDate)
          .toISOString()
          .split('T')[0];
      }
      if (this.currentCoupon.endDate) {
        this.currentCoupon.endDate = new Date(this.currentCoupon.endDate)
          .toISOString()
          .split('T')[0];
      }

      console.log(this.currentCoupon, 'current coupon');
      this.couponEdit.open = true;
    },

    // Method to close the edit modal
    closeEditModal() {
      this.couponEdit.open = false;
    },
  }));
});

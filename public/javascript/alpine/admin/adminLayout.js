// adminAlpine.js
document.addEventListener('alpine:init', () => {
  Alpine.data('adminLayout', () => ({
    // formatDate(dateStr) {
    //   if (!dateStr) return '';
    //   const date = new Date(dateStr);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   return `${day}-${month}-${year}`;
    // },

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
      // this.currentCoupon = {
      //   ...coupon,
      //   startDate: this.formatDate(coupon.startDate),
      //   endDate: this.formatDate(coupon.endDate),
      // };
      this.currentCoupon = coupon;

      this.couponEdit.open = true;
    },

    // Method to close the edit modal
    closeEditModal() {
      this.couponEdit.open = false;
    },
  }));
});

// /javascript/alpine/admin/coupon.js
function getCouponSummery() {
  return {
    coupons: [],
    get all() {
      return this.coupons.length;
    },
    get active() {
      return this.coupons.filter((c) => c.isActive).length;
    },
    get expired() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.coupons.filter((c) => {
        const endDate = new Date(c.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate.getTime() < today.getTime();
      }).length;
    },
    get inactive() {
      return this.coupons.filter(
        (c) => !c.isActive && new Date(c.endDate) >= new Date()
      ).length;
    },
    initData(data) {
      this.coupons = data;
    },
  };
}

function listAllCoupons() {
  return {
    coupons: [],
    search: '',
    status: '',
    type: '',
    currentPage: 1,
    itemsPerPage: 5,
    initData(data) {
      this.coupons = data;
    },
    get filteredCoupons() {
      return this.coupons.filter((c) => {
        const matchSearch =
          this.search === '' ||
          c.code.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus =
          this.status === '' ||
          (this.status === 'active' && c.isActive) ||
          (this.status === 'inactive' &&
            !c.isActive &&
            new Date(c.endDate) >= new Date()) ||
          (this.status === 'expired' &&
            (() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const endDate = new Date(c.endDate);
              endDate.setHours(0, 0, 0, 0);
              return endDate.getTime() < today.getTime();
            })());
        const matchType = this.type === '' || c.discountType === this.type;
        return matchSearch && matchStatus && matchType;
      });
    },
    get paginatedCoupons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCoupons.slice(start, end);
    },
    get totalPages() {
      return Math.ceil(this.filteredCoupons.length / this.itemsPerPage);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    $watch(search, status, type) {
      this.currentPage = 1;
    },
  };
}

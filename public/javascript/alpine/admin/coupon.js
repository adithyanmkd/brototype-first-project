// display coupon summery
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
      //   console.log(this.coupons);
    },
  };
}

// listing all coupons
function listAllCoupons() {
  return {
    coupons: [],
    search: '',
    status: '',
    type: '',
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
    initData(data) {
      this.coupons = data;
    },
  };
}

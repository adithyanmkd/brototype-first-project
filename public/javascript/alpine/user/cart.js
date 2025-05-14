// export function cartComponent({
//   availableCoupons = [],
//   items = [],
//   initialCouponDiscount = 0,
// }) {
//   return {
//     couponCode: '',
//     newDiscount: false,
//     availableCoupons,
//     items,
//     updateQuantity(index, delta) {
//       const newQty = this.items[index].quantity + delta;

//       if (newQty > 3) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Oops...',
//           text: 'Max quantity reached!!',
//         });
//         return;
//       }

//       if (newQty >= 1 && newQty <= 3) {
//         this.items[index].quantity = newQty;
//       }
//     },

//     get totalSellingPrice() {
//       return this.items.reduce(
//         (acc, item) => acc + item.quantity * item.sellingPrice,
//         0
//       );
//     },

//     get totalOriginalPrice() {
//       return this.items.reduce(
//         (acc, item) => acc + item.quantity * item.originalPrice,
//         0
//       );
//     },

//     get matchedCoupon() {
//       return this.availableCoupons.find((c) => c.code === this.couponCode);
//     },

//     get couponDiscount() {
//       let couponDiscount = Number(initialCouponDiscount);
//       if (couponDiscount) return couponDiscount;
//       if (!this.matchedCoupon) return 0;
//       if (!this.isCouponEligible(this.matchedCoupon)) {
//         this.couponCode = '';
//         return 0;
//       }

//       const baseDiscount =
//         this.matchedCoupon.discountType === 'percentage'
//           ? Math.round(
//               (this.totalSellingPrice * this.matchedCoupon.discountValue) / 100
//             )
//           : this.matchedCoupon.discountValue;

//       const maxCap = this.matchedCoupon.maxDiscountAmount ?? Infinity;
//       return Math.min(baseDiscount, maxCap, this.totalSellingPrice);
//     },
//     get finalTotal() {
//       return this.totalSellingPrice - this.couponDiscount;
//     },
//     isCouponEligible(coupon) {
//       return this.totalSellingPrice >= coupon.minOrderAmount;
//     },
//   };
// }

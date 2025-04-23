document.addEventListener('alpine:init', () => {
  Alpine.data('orderDetails', () => ({
    isReturn: ['Returned', 'Return Requested', 'Return Rejected'].includes(
      '<%= order.orderStatus %>'
    ),
    isCancelled: 'Cancelled' === '<%= order.orderStatus %>',
    paymentStatus: '<%= order.paymentStatus %>',
    status: '<%= order.orderStatus %>',
  }));
});

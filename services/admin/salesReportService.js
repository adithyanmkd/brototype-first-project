import Order from '../../models/orderModel.js';

const SalesReportService = {
  getSalesData: async ({ range = '1w', startDate, endDate }) => {
    try {
      let salesData;
      let queryStartDate;
      let queryEndDate;

      // Prioritize custom range if startDate and endDate are provided
      if (startDate && endDate) {
        queryStartDate = new Date(startDate);
        queryEndDate = new Date(endDate);

        if (isNaN(queryStartDate) || isNaN(queryEndDate)) {
          throw new Error('Invalid startDate or endDate format');
        }

        if (queryStartDate > queryEndDate) {
          throw new Error('startDate cannot be after endDate');
        }

        // Normalize dates to include the full endDate
        queryStartDate.setUTCHours(0, 0, 0, 0);
        queryEndDate.setUTCHours(23, 59, 59, 999);

        salesData = await Order.find({
          orderDate: { $gte: queryStartDate, $lte: queryEndDate },
          orderStatus: 'Delivered',
        });

        console.log('Custom range sales data:', salesData);
      } else if (range) {
        // Handle predefined range (1d, 1w, 1m)
        queryStartDate = new Date();
        queryEndDate = new Date(); // End date is today

        if (range === '1d') {
          queryStartDate.setDate(queryStartDate.getDate() - 1);
        } else if (range === '1w') {
          queryStartDate.setDate(queryStartDate.getDate() - 7);
        } else if (range === '1m') {
          queryStartDate.setMonth(queryStartDate.getMonth() - 1);
        } else {
          throw new Error('Invalid range value');
        }

        // Normalize dates to UTC and reset time for consistency
        queryStartDate.setUTCHours(0, 0, 0, 0);
        queryEndDate.setUTCHours(23, 59, 59, 999);

        // console.log('Range query dates:', queryStartDate, queryEndDate);

        salesData = await Order.find({
          orderDate: { $gte: queryStartDate, $lte: queryEndDate },
          orderStatus: 'Delivered',
        });
      } else {
        throw new Error('Invalid filters provided');
      }

      if (salesData.length === 0) {
        return {
          totalSales: 0,
          totalDiscounts: 0,
          totalOrders: 0,
          salesDetails: [],
          message: 'No delivered orders found for the specified date range',
        };
      }

      // Process data to include discounts, coupons, and totals
      const totalSales = salesData.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );
      const totalDiscounts = salesData.reduce(
        (sum, sale) => sum + (sale.discountAmount || 0),
        0
      );

      const totalOrders = salesData.length;

      return {
        totalSales,
        totalDiscounts,
        totalOrders,
        salesDetails: salesData,
      };
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw new Error('Failed to fetch sales data');
    }
  },
};

export default SalesReportService;

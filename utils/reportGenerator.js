import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// Generate a PDF report for sales data
export const generatePDF = async (salesData) => {
  const doc = new PDFDocument();
  const buffers = [];

  // Capture PDF data into buffers
  doc.on('data', (chunk) => buffers.push(chunk));
  doc.on('end', () => {
    console.log('PDF generation completed');
  });

  // Add title
  doc.fontSize(20).text('Sales Report', { align: 'center' });
  doc.moveDown();

  // Add summary
  if (salesData) {
    doc.fontSize(12).text(`Total Sales: ₹${salesData.totalSales}`);
    doc.text(`Total Discounts: ₹${salesData.totalDiscounts}`);
    doc.text(`Total Orders: ${salesData.totalOrders}`);
    doc.moveDown();
  } else {
    doc.fontSize(12).text('No sales data available.');
    doc.end();
    return Buffer.concat(buffers);
  }

  // Add table header
  doc.fontSize(12).text('Order Details:', { underline: true });
  doc.moveDown();
  doc.text(
    'Order ID | Amount | Discount | Date | Delivery Address | Ordered Items',
    { continued: false }
  );
  doc.moveDown();

  // Add table rows
  if (salesData.salesDetails && salesData.salesDetails.length > 0) {
    salesData.salesDetails.forEach((sale) => {
      const deliveryAddress = sale.deliveryAddress
        ? `${sale.deliveryAddress.name}, ${sale.deliveryAddress.address}, ${sale.deliveryAddress.locality}, ${sale.deliveryAddress.district}, ${sale.deliveryAddress.state}, ${sale.deliveryAddress.pincode}`
        : 'N/A';

      const orderedItems = sale.orderedItems
        ? sale.orderedItems
            .map((item) => `${item.productName} (x${item.quantity})`)
            .join(', ')
        : 'N/A';

      doc.text(
        `${sale.orderId} | ₹${sale.totalAmount} | ₹${sale.discountAmount || 0} | ${new Date(
          sale.orderDate
        ).toLocaleDateString()} | ${deliveryAddress} | ${orderedItems}`
      );
    });
  } else {
    doc.text('No sales data available.');
  }

  // Finalize the PDF
  doc.end();

  // Return the PDF as a buffer
  return Buffer.concat(buffers);
};

// Generate an Excel report for sales data
export const generateExcel = async (salesData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Add title
  worksheet.mergeCells('A1', 'D1');
  worksheet.getCell('A1').value = 'Sales Report';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Add summary
  worksheet.addRow([]);
  worksheet.addRow(['Total Sales', salesData.totalSales]);
  worksheet.addRow(['Total Discounts', salesData.totalDiscounts]);
  worksheet.addRow(['Total Orders', salesData.totalOrders]);
  worksheet.addRow([]);

  // Add table header
  worksheet.addRow(['Order ID', 'Amount', 'Discount', 'Date']);
  worksheet.getRow(6).font = { bold: true };

  // Add table rows
  salesData.salesDetails.forEach((sale) => {
    worksheet.addRow([
      sale.orderId,
      sale.totalAmount,
      sale.discountAmount || 0,
      new Date(sale.orderDate).toLocaleDateString(),
    ]);
  });

  // Generate Excel file as a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

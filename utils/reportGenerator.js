import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import ExcelJS from 'exceljs';

//fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a PDF report for sales data
// export const generatePDF = async (salesData) => {
//   const doc = new PDFDocument();
//   const buffers = [];

//   // Capture PDF data into buffers
//   doc.on('data', (chunk) => buffers.push(chunk));
//   doc.on('end', () => {
//     console.log('PDF generation completed');
//   });

//   try {
//     // Add title
//     doc.fontSize(20).text('Sales Report', { align: 'center' });
//     doc.moveDown();

//     // Add summary
//     if (salesData) {
//       doc.fontSize(12).text(`Total Sales: ₹${salesData.totalSales}`);
//       doc.text(`Total Discounts: ₹${salesData.totalDiscounts}`);
//       doc.text(`Total Orders: ${salesData.totalOrders}`);
//       doc.moveDown();
//     } else {
//       doc.fontSize(12).text('No sales data available.');
//       doc.end();
//       return Buffer.concat(buffers);
//     }

//     // Add table header
//     doc.fontSize(12).text('Order Details:', { underline: true });
//     doc.moveDown();
//     doc.text(
//       'Order ID | Amount | Discount | Date | Delivery Address | Ordered Items',
//       { continued: false }
//     );
//     doc.moveDown();

//     // Add table rows
//     if (salesData.salesDetails && salesData.salesDetails.length > 0) {
//       salesData.salesDetails.forEach((sale) => {
//         console.log('Processing sale:', sale); // Debugging: Check each sale

//         const deliveryAddress = sale.deliveryAddress
//           ? `${sale.deliveryAddress.name}, ${sale.deliveryAddress.address}, ${sale.deliveryAddress.locality}, ${sale.deliveryAddress.district}, ${sale.deliveryAddress.state}, ${sale.deliveryAddress.pincode}`
//           : 'N/A';

//         const orderedItems = sale.orderedItems
//           ? sale.orderedItems
//               .map((item) => `${item.productName} (x${item.quantity})`)
//               .join(', ')
//           : 'N/A';

//         console.log('Adding to PDF:', {
//           orderId: sale.orderId,
//           totalAmount: sale.totalAmount,
//           discountAmount: sale.discountAmount,
//           orderDate: sale.orderDate,
//           deliveryAddress,
//           orderedItems,
//         });

//         // Add row to the PDF
//         doc.text(
//           `${sale.orderId} | ₹${sale.totalAmount} | ₹${sale.discountAmount || 0} | ${new Date(
//             sale.orderDate
//           ).toLocaleDateString()} | ${deliveryAddress} | ${orderedItems}`,
//           {
//             width: 500, // Limit the width of the text
//             align: 'left', // Align text to the left
//           }
//         );
//         doc.moveDown();
//       });
//     } else {
//       console.log('No sales details available.');
//       doc.text('No sales data available.');
//     }

//     // Finalize the PDF
//     doc.end();
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     doc.text('An error occurred while generating the PDF.');
//     doc.end();
//   }

//   // Return the PDF as a buffer
//   return Buffer.concat(buffers);
// };

// Generate a PDF report for sales data
export const generatePDF = async (salesData) => {
  try {
    console.log('Generating PDF with sales data:', salesData); // Debugging: Check salesData

    // Path to the HTML template
    const templatePath = path.join(
      __dirname,
      '../templates/salesReportTemplate.html'
    );

    // Render the HTML template with sales data
    const html = await ejs.renderFile(templatePath, salesData);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Close the browser
    await browser.close();

    // console.log('PDF buffer generated successfully:', pdfBuffer); // Debugging: Check PDF buffer
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Generate an Excel report for sales data
export const generateExcel = async (salesData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Add title
  worksheet.mergeCells('A1', 'H1');
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
  worksheet.addRow([
    'Order ID',
    'Amount',
    'Discount',
    'Date',
    'Delivery Address',
    'Ordered Items',
    'Product Name',
    'Category',
  ]);
  worksheet.getRow(6).font = { bold: true };

  // Add table rows
  salesData.salesDetails.forEach((sale) => {
    const deliveryAddress = sale.deliveryAddress
      ? `${sale.deliveryAddress.name}, ${sale.deliveryAddress.address}, ${sale.deliveryAddress.locality}, ${sale.deliveryAddress.district}, ${sale.deliveryAddress.state}, ${sale.deliveryAddress.pincode}`
      : 'N/A';

    const orderedItems = sale.orderedItems
      ? sale.orderedItems
          .map((item) => `${item.productName} (x${item.quantity})`)
          .join(', ')
      : 'N/A';

    const productNames = sale.orderedItems
      ? sale.orderedItems.map((item) => item.productName).join(', ')
      : 'N/A';

    const categories = sale.orderedItems
      ? sale.orderedItems.map((item) => item.category).join(', ')
      : 'N/A';

    worksheet.addRow([
      sale.orderId,
      sale.totalAmount,
      sale.discountAmount || 0,
      new Date(sale.orderDate).toLocaleDateString(),
      deliveryAddress,
      orderedItems,
      productNames,
      categories,
    ]);
  });

  // Generate Excel file as a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

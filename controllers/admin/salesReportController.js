import SalesReportService from '../../services/salesReportService.js';
import { generatePDF, generateExcel } from '../../utils/reportGenerator.js';

// Controller to fetch sales report based on filters
const getSalesReport = async (req, res) => {
  try {
    const { range, startDate, endDate, format } = req.query;

    // Fetch sales data from the service
    const salesData = await SalesReportService.getSalesData({
      range,
      startDate,
      endDate,
    });

    // Return data in JSON format if no download is requested
    if (!format) {
      return res.status(200).json({
        message: 'Sales report fetched successfully',
        data: salesData,
      });
    }

    // Generate and send the report in the requested format
    if (format === 'pdf') {
      // console.log('Generating PDF with sales data:', salesData);
      const pdfBuffer = await generatePDF(salesData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sales-report.pdf"'
      );
      return res.send(pdfBuffer);
    } else if (format === 'excel') {
      const excelBuffer = await generateExcel(salesData);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sales-report.xlsx"'
      );
      return res.send(excelBuffer);
    }

    // Handle invalid format requests
    res.status(400).json({ message: 'Invalid format requested' });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

let salesReportController = {
  getSalesReport,
};

export default salesReportController;

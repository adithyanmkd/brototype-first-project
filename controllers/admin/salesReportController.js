import { generatePDF, generateExcel } from '../../utils/reportGenerator.js';
import fs from 'fs';

// sevices
import SalesReportService from '../../services/admin/salesReportService.js';

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

    if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
      // If the request is AJAX or accepts JSON (like axios)
      return res.status(200).json({
        message: 'Sales report fetched successfully',
        data: salesData,
      });
    }

    // Return data in JSON format if no download is requested
    if (!format) {
      // If the request is AJAX or accepts JSON (like axios)
      if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
        return res.status(200).json({
          message: 'Sales report fetched successfully',
          data: salesData,
        });
      } else {
        return res.render('admin/pages/salesReport/salesReport.ejs', {
          layout: 'layouts/admin-layout.ejs',
        });
      }
    }

    // Generate and send the report in the requested format
    if (format === 'pdf') {
      // console.log(salesData, 'salesData');
      const pdfBuffer = await generatePDF(salesData);
      // console.log('PDF buffer:', pdfBuffer);
      fs.writeFileSync('sales-report.pdf', pdfBuffer);

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

const getSalesReport = async (range, startDate, endDate) => {
  try {
    let url = `/admin/sales-report?range=${range}`;

    if (range === 'custom') {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales report');
    }

    const data = await response.json();
    return data; // returning only the actual data
  } catch (error) {
    console.error('Error fetching sales report:', error);
    throw error;
  }
};

export { getSalesReport };

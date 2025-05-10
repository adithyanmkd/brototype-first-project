// user chart
const userChart = async (range = 7) => {
  try {
    const res = await fetch(`/admin/user-chart?range=${range}`);
    const data = await res.json();

    const options = {
      chart: {
        height: '100%',
        maxWidth: '100%',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
        curve: 'smooth',
        colors: ['#1A56DB'],
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      series: [
        {
          name: 'New users',
          data: data.values,
          color: '#1A56DB',
        },
      ],
      xaxis: {
        categories: data.categories,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    };

    const chartEl = document.getElementById('area-chart');
    const totalUserElm = document.querySelector('#users');

    if (chartEl && typeof ApexCharts !== 'undefined') {
      // Destroy previous chart if any
      if (window.areaChartInstance) {
        window.areaChartInstance.destroy();
      }

      totalUserElm.innerHTML = data.totalUsers;
      window.areaChartInstance = new ApexCharts(chartEl, options);
      window.areaChartInstance.render();
    }
  } catch (err) {
    console.error('Chart loading error:', err);
  }
};

const revenueChart = async (range = 7) => {
  try {
    const res = await fetch(`/admin/revenue-chart-data?range=${range}`);
    if (!res.ok) {
      alert('Failed to fetch revenue data');
      return;
    }

    const converted = await res.json();
    const raw = converted.data;

    console.log(raw);

    // Generate full date range
    const today = new Date();
    const datesInRange = Array.from({ length: range }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (range - 1 - i));
      return date.toISOString().split('T')[0];
    });

    // Map backend data for fast lookup
    const revenueMap = {};
    raw.forEach((item) => {
      revenueMap[item._id] = item.totalRevenue;
    });

    // Build complete data arrays
    const categories = [];
    const values = [];
    let totalRevenue = 0;

    if (range === 365) {
      // Group by month
      const monthlyMap = {};
      raw.forEach((item) => {
        const month = new Date(item._id).toLocaleString('default', {
          month: 'short',
        });
        monthlyMap[month] = (monthlyMap[month] || 0) + item.totalRevenue;
      });
      Object.entries(monthlyMap).forEach(([month, value]) => {
        categories.push(month);
        values.push(value);
        totalRevenue += value;
      });
    } else if (range >= 90) {
      // Group by week
      const weekMap = {};
      raw.forEach((item) => {
        const date = new Date(item._id);
        const weekLabel = `W${Math.ceil(date.getDate() / 7)} ${date.toLocaleString('default', { month: 'short' })}`;
        weekMap[weekLabel] = (weekMap[weekLabel] || 0) + item.totalRevenue;
      });
      Object.entries(weekMap).forEach(([week, value]) => {
        categories.push(week);
        values.push(value);
        totalRevenue += value;
      });
    } else {
      // Daily view
      datesInRange.forEach((date) => {
        const value = revenueMap[date] || 0;
        categories.push(date);
        values.push(value);
        totalRevenue += value;
      });
    }

    const data = {
      categories,
      values,
      totalRevenue,
    };

    // console.log(data.totalRevenue, 'total revenue');

    const options = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#3B82F6'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 90, 100],
          colorStops: [
            [
              {
                offset: 0,
                color: '#3B82F6',
                opacity: 0.3,
              },
              {
                offset: 100,
                color: '#3B82F6',
                opacity: 0.05,
              },
            ],
          ],
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      xaxis: {
        categories: data.categories,
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`;
          },
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `₹${val.toLocaleString()}`,
        },
      },
      series: [
        {
          name: 'Revenue',
          data: data.values,
        },
      ],
    };

    const chartEl = document.getElementById('revenue-chart');
    const totalRevenueElm = document.querySelector('#revenue');

    if (chartEl && typeof ApexCharts !== 'undefined') {
      if (window.revenueChartInstance) {
        window.revenueChartInstance.destroy();
      }

      totalRevenueElm.innerHTML = `₹${data.totalRevenue.toLocaleString()}`;
      window.revenueChartInstance = new ApexCharts(chartEl, options);
      window.revenueChartInstance.render();
    }
  } catch (error) {
    console.error('Revenue chart loading error:', error);
  }
};

// export handlers
export { userChart, revenueChart };

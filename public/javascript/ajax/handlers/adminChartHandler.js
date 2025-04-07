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

// export handlers
export { userChart };

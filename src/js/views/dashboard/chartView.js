import lineConfig from '../../charts/lineChart.js';
import doughnutConfig from '../../charts/doughnutChart.js';

//The most common is net income divided by the total cost of the investment, or ROI = Net income / Cost of investment x 100.

class ChartView {
  _parentElement = document.querySelector('main');
  _doughnutChart;
  _lineChart;

  renderChart() {
    return `
      <section class="canvas"
        <div class="roi_income_chart_cont">
          <canvas id="roi"></canvas>
        </div>
        <div class="bi_income_chart_cont">
          <canvas width="300px" height="300px" id="bi"></canvas>
        </div>
      </section>`
  }

  createChart(user) {
    this._doughnutChart = document.getElementById('roi');
    this._lineChart = document.getElementById('lines');

    const lineChart = new Chart(this._lineChart, lineConfig);
    const doughnutChart = new Chart(this._doughnutChart, doughnutConfig);

    this._updateChartColor(doughnutChart, 'doughnutChart', user);
    this._updateChartColor(lineChart, 'lineChart', user);
  }

  //it takes a chart which and a chart variable which user want to update
  _updateChartColor(chart, chartName, user) {
    const { charts } = user.data.preference;

    const bgColorArr = ['rgba(192, 140, 236, 1)', 'rgba(95, 142, 219, 1)', 'rgba(244, 67, 115, 1)', 'rgba(224, 183, 26, 1)', 'rgba(112, 129, 243, 1)', 'rgba(233, 212, 245, 1)', 'rgba(195, 199, 244, 1)', 'rgba(255, 0, 20, 1)', 'rgba(109, 106, 255, 1)', 'rgba(231, 194, 122, 1)'];

    switch (chartName) {
      case 'doughnutChart':
        chart.config.type = charts.ROI;
        if (charts.ROI === 'line') chart.config.data.datasets[0].borderColor = 'rgba(142, 74, 237, 0.8)';
        break;
      case 'lineChart':
        if (charts.BI !== 'line') {

          chart.config.type = charts.BI;
          chart.config.data.datasets[0].backgroundColor = [...bgColorArr];

          chart.config.data.datasets[0].borderColor = '#fff';

          if (charts.BI === 'line') {
            chart.config.data.datasets[0].backgroundColor = '#fff';

            chart.config.data.datasets[0].borderColor = 'rgba(142, 74, 237, 0.8)';
          }
        }
        break;
      default:
        return
    }
    chart.update();
  }
}

export default new ChartView();
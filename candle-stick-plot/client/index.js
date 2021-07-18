const chartProperties = {
  width: 1500,
  height: 600,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
};

const domElement = document.getElementById("tvchart");
const chart = LightweightCharts.createChart(domElement, chartProperties);
const candleSeries = chart.addCandlestickSeries();

fetch(`http://localhost:8000/data`)
  .then((res) => res.json())
  .then((data) => {
    candleSeries.setData(data);
  })
  .catch((err) => console.log(err));

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzv32zYNIGV7yfag-gs8UYSRHKAm_1VwLyq-c_qynh-dFk5RjFX-HC8G_sPPlEfKJW5/exec?read=true";

let tempChart, humChart, pressChart;

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const charts = document.querySelectorAll(".chart-container");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const target = card.dataset.target;
      charts.forEach(chart => {
        chart.classList.toggle("active", chart.id === target);
      });
    });
  });
});

function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("temp").textContent = data.temperature.at(-1).toFixed(1);
      document.getElementById("hum").textContent = data.humidity.at(-1).toFixed(1);
      document.getElementById("press").textContent = data.pressure.at(-1).toFixed(1);
      document.getElementById("timestamp").textContent =
        new Date(data.timestamp).toLocaleString();

      const labels = data.temperature.map((_, i) => i + 1);

      tempChart?.destroy();
      humChart?.destroy();
      pressChart?.destroy();

      tempChart = new Chart(tempChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.temperature,
            borderColor: "#ff5252",
            backgroundColor: "rgba(255,82,82,0.25)",
            fill: true,
            tension: 0.35
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });

      humChart = new Chart(humChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.humidity,
            borderColor: "#40c4ff",
            backgroundColor: "rgba(64,196,255,0.25)",
            fill: true,
            tension: 0.35
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });


      pressChart = new Chart(pressChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.pressure,
            borderColor: "#69f0ae",
            backgroundColor: "rgba(105,240,174,0.25)",
            fill: true,
            tension: 0.35
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });
}

function tempChartCanvas() { return document.getElementById("tempChart"); }
function humChartCanvas() { return document.getElementById("humChart"); }
function pressChartCanvas() { return document.getElementById("pressChart"); }

loadData();

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzv32zYNIGV7yfag-gs8UYSRHKAm_1VwLyq-c_qynh-dFk5RjFX-HC8G_sPPlEfKJW5/exec?read=true";

let tempChart, humChart, pressChart;

/* ==============================
   INTERACTION CARTES → GRAPHES
============================== */
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

/* ==============================
   HELPER : GRADIENT ANIMÉ
============================== */
function createGradient(ctx, chartArea, colorStart, colorEnd, shift = 0) {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, `rgba(${colorStart},${0.4 + 0.1 * shift})`);
  gradient.addColorStop(1, `rgba(${colorEnd},${0.6 + 0.1 * shift})`);
  return gradient;
}

/* ==============================
   CHARGEMENT DES DONNÉES
============================== */
function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {

      // Affichage des dernières valeurs
      document.getElementById("temp").textContent = data.temperature.at(-1).toFixed(1);
      document.getElementById("hum").textContent = data.humidity.at(-1).toFixed(1);
      document.getElementById("press").textContent = data.pressure.at(-1).toFixed(1);
      document.getElementById("timestamp").textContent =
        new Date(data.timestamp).toLocaleString();

      const labels = data.temperature.map((_, i) => i + 1);

      // Destruction anciens graphiques
      tempChart?.destroy();
      humChart?.destroy();
      pressChart?.destroy();

      // =========================
      // TEMPÉRATURE
      // =========================
      tempChart = new Chart(tempChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.temperature,
            borderColor: "#ff5252",
            tension: 0.35,
            fill: true,
            backgroundColor: function(ctx) {
              const chart = ctx.chart;
              const {ctx: c, chartArea} = chart;
              if (!chartArea) return null;
              const t = Date.now() / 1500;
              const shift = (Math.sin(t) + 1) / 2;
              return createGradient(c, chartArea, "200,0,0", "255,138,101", shift);
            }
          }]
        },
        options: chartOptions()
      });

      // =========================
      // HUMIDITÉ
      // =========================
      humChart = new Chart(humChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.humidity,
            borderColor: "#40c4ff",
            tension: 0.35,
            fill: true,
            backgroundColor: function(ctx) {
              const chart = ctx.chart;
              const {ctx: c, chartArea} = chart;
              if (!chartArea) return null;
              const t = Date.now() / 1500;
              const shift = (Math.sin(t + 1) + 1) / 2; // décalage léger pour variation
              return createGradient(c, chartArea, "0,100,255", "0,229,255", shift);
            }
          }]
        },
        options: chartOptions()
      });

      // =========================
      // PRESSION
      // =========================
      pressChart = new Chart(pressChartCanvas(), {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: data.pressure,
            borderColor: "#69f0ae",
            tension: 0.35,
            fill: true,
            backgroundColor: function(ctx) {
              const chart = ctx.chart;
              const {ctx: c, chartArea} = chart;
              if (!chartArea) return null;
              const t = Date.now() / 1500;
              const shift = (Math.sin(t + 2) + 1) / 2; // décalage pour variation indépendante
              return createGradient(c, chartArea, "0,150,80", "105,240,174", shift);
            }
          }]
        },
        options: chartOptions()
      });

      // 🔁 Mise à jour continue pour le gradient animé
      requestAnimationFrame(animateGradients);
    });
}

/* ==============================
   OPTIONS COMMUNES
============================== */
function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    animation: { duration: 800, easing: "easeOutQuart" },
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { display: false } },
      y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.05)" } }
    }
  };
}

/* ==============================
   HELPERS CANVAS
============================== */
function tempChartCanvas() { return document.getElementById("tempChart"); }
function humChartCanvas() { return document.getElementById("humChart"); }
function pressChartCanvas() { return document.getElementById("pressChart"); }

/* ==============================
   ANIMATION DES GRADIENTS
============================== */
function animateGradients() {
  [tempChart, humChart, pressChart].forEach(chart => {
    if (chart) chart.update("none"); // "none" = pas d'animation, juste redessiner
  });
  requestAnimationFrame(animateGradients);
}

/* ==============================
   INIT
============================== */
loadData();

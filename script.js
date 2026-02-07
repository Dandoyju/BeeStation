const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyFAUylYgbvbmNAPWNmiazXlX_ZyApuyMehtOPHw6yPfmdaxOFDXSeil9pm-Yl3GE/exec?read=true";

// Variables globales pour stocker les charts
let tempChart, humChart, pressChart;

// Fonction pour charger les données et mettre à jour le DOM + graphiques
function loadData() {
  fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {

      // ===============================
      // 🔹 Dernières valeurs
      // ===============================
      const lastTemp = data.temperature.at(-1);
      const lastHum = data.humidity.at(-1);
      const lastPress = data.pressure.at(-1);
      const lastTimestamp = data.timestamps.at(-1);

      document.getElementById("temp").textContent = lastTemp.toFixed(1);
      document.getElementById("hum").textContent = lastHum.toFixed(1);
      document.getElementById("press").textContent = lastPress.toFixed(1);
      document.getElementById("timestamp").textContent =
        new Date(lastTimestamp).toLocaleString("fr-FR");

      // ===============================
      // 🔹 Labels = heures
      // ===============================
      const labels = data.timestamps.map(t =>
        new Date(t).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      );

      // Détruire les anciens charts s’ils existent
      if (tempChart) tempChart.destroy();
      if (humChart) humChart.destroy();
      if (pressChart) pressChart.destroy();

      // ===============================
      // 🌡 Température
      // ===============================
      tempChart = new Chart(document.getElementById("tempChart"), {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Température (°C)",
            data: data.temperature,
            fill: true,
            tension: 0.3,
            borderColor: "rgba(239, 83, 80, 1)",
            backgroundColor: "rgba(239, 83, 80, 0.25)"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 40,
              ticks: { stepSize: 5 }
            }
          }
        }
      });

      // ===============================
      // 💧 Humidité
      // ===============================
      humChart = new Chart(document.getElementById("humChart"), {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Humidité (%)",
            data: data.humidity,
            fill: true,
            tension: 0.3,
            borderColor: "rgba(66, 165, 245, 1)",
            backgroundColor: "rgba(66, 165, 245, 0.25)"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 100
            }
          }
        }
      });

      // ===============================
      // 🌬 Pression
      // ===============================
      pressChart = new Chart(document.getElementById("pressChart"), {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Pression (hPa)",
            data: data.pressure,
            fill: true,
            tension: 0.3,
            borderColor: "rgba(102, 187, 106, 1)",
            backgroundColor: "rgba(102, 187, 106, 0.25)"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 950,
              max: 1050
            }
          }
        }
      });

    })
    .catch(err => console.error("Erreur de chargement des données :", err));
}

// Chargement initial
loadData();

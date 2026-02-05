fetch("https://script.google.com/macros/s/AKfycbw6InLjqGZd3Bhv_O3iTJ20VKcRI_LQVGXaF9B3LC0LmawmlC-80u-e4YURgIh7MWkI/exec")
 .then(response => response.json())
  .then(data => {

    // Dernières valeurs
    const lastTemp = data.temperature.at(-1);
    const lastHum = data.humidity.at(-1);
    const lastPress = data.pressure.at(-1);

    document.getElementById("temp").textContent = lastTemp.toFixed(1);
    document.getElementById("hum").textContent = lastHum.toFixed(1);
    document.getElementById("press").textContent = lastPress.toFixed(1);
    document.getElementById("timestamp").textContent =
      new Date(data.timestamp).toLocaleString();

    // Labels communs
    const labels = data.temperature.map((_, i) => i + 1);

    // Température
    new Chart(document.getElementById("tempChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Température (°C)",
          data: data.temperature,
          tension: 0.3
        }]
      },
      options: {
        responsive: true
      }
    });

    // Humidité
    new Chart(document.getElementById("humChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Humidité (%)",
          data: data.humidity,
          tension: 0.3
        }]
      },
      options: {
        responsive: true
      }
    });

    // Pression
    new Chart(document.getElementById("pressChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Pression (hPa)",
          data: data.pressure,
          tension: 0.3
        }]
      },
      options: {
        responsive: true
      }
    });

  })
  .catch(err => {
    console.error("Erreur de chargement des données :", err);
  });
fetch("https://script.google.com/macros/s/AKfycbw6InLjqGZd3Bhv_O3iTJ20VKcRI_LQVGXaF9B3LC0LmawmlC-80u-e4YURgIh7MWkI/exec")
  .then(response => response.json())
  .then(data => {
    // Valeurs actuelles (dernière valeur du tableau)
    const lastTemp = data.temperature.at(-1);
    const lastHum = data.humidity.at(-1);
    const lastPress = data.pressure.at(-1);

    document.getElementById("temp").textContent = lastTemp.toFixed(1);
    document.getElementById("hum").textContent = lastHum.toFixed(1);
    document.getElementById("press").textContent = lastPress.toFixed(1);
    document.getElementById("timestamp").textContent =
      new Date(data.timestamp).toLocaleString();

    // Graphique
    const labels = data.temperature.map((_, i) => `T-${data.temperature.length - i}`);

    const ctx = document.getElementById("weatherChart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Température (°C)",
            data: data.temperature,
            tension: 0.3
          },
          {
            label: "Humidité (%)",
            data: data.humidity,
            tension: 0.3
          },
          {
            label: "Pression (hPa)",
            data: data.pressure,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  })
  .catch(err => {
    console.error("Erreur de chargement des données :", err);
  });

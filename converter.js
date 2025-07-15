window.onload = function () {
  const API_KEY = "a76ecbff61035f0c75d03751";
  const BASE_URL = "https://v6.exchangerate-api.com/v6";

  const fromAmount = document.getElementById("from-currency-amount");
  const toAmount = document.getElementById("to-currency-amount");
  const fromSelect = document.getElementById("from-currency");
  const toSelect = document.getElementById("to-currency");
  const swapBtn = document.getElementById("swap-btn");

  const currencyList = ["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];

  // Populate both dropdowns
  currencyList.forEach(currency => {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    fromSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    toSelect.appendChild(option2);
  });

  // Default selection
  fromSelect.value = "USD";
  toSelect.value = "INR";

  // Conversion function
  async function convertCurrency() {
    const from = fromSelect.value;
    const to = toSelect.value;
    const amount = parseFloat(fromAmount.value);

    if (isNaN(amount) || amount <= 0) {
      toAmount.value = "";
      return;
    }

    const url = `${BASE_URL}/${API_KEY}/pair/${from}/${to}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.result === "success") {
        const rate = data.conversion_rate;
        const converted = (amount * rate).toFixed(2);
        toAmount.value = converted;
        fetchHistory(from, to);
      } else {
        console.error("API error:", data["error-type"]);
        toAmount.value = "Error";
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      toAmount.value = "Error";
    }
  }

  // Swap logic
  swapBtn.addEventListener("click", () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convertCurrency();
  });

  // Trigger conversion on input/select change
  fromAmount.addEventListener("input", convertCurrency);
  fromSelect.addEventListener("change", convertCurrency);
  toSelect.addEventListener("change", convertCurrency);

  // Initial conversion
  convertCurrency();
};
// 📉 Historical graph logic
async function fetchHistory(from, to) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);

  const formatDate = d => d.toISOString().split('T')[0];
  const url = `https://api.exchangerate.host/timeseries?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&base=${from}&symbols=${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      const labels = Object.keys(data.rates);
      const rates = labels.map(date => data.rates[date][to]);

      drawChart(labels, rates, from, to);
    } else {
      console.error("Failed to fetch history data");
    }
  } catch (err) {
    console.error("Error loading chart data:", err);
  }
}

let chartInstance = null;

function drawChart(labels, data, from, to) {
  const ctx = document.getElementById("historyChart").getContext("2d");

  if (chartInstance) chartInstance.destroy(); // Prevent duplicate charts

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${from} to ${to}`,
        data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

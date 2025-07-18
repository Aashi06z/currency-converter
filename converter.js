window.onload = function () {
 const API_KEY = "a76ecbff61035f0c75d03751";
  const BASE_URL = "https://v6.exchangerate-api.com/v6";

  const fromAmount = document.getElementById("from-currency-amount");
  const toAmount = document.getElementById("to-currency-amount");
  const fromSelect = document.getElementById("from-currency");
  const toSelect = document.getElementById("to-currency");

  const currencyList = ["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];

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

  // Set default selections
  fromSelect.value = "USD";
  toSelect.value = "INR";

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
      } else {
        console.error("API error:", data["error-type"]);
        toAmount.value = "Error";
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      toAmount.value = "Error";
    }
  }

  fromAmount.addEventListener("input", convertCurrency);
  fromSelect.addEventListener("change", convertCurrency);
  toSelect.addEventListener("change", convertCurrency);
};

swapBtn.addEventListener("click", () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency(); // call conversion again after swapping
});

window.onload = function () {
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

  // Swap logic
  swapBtn.addEventListener("click", () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
  });

  // Clear converted amount on input/select change
  function clearToAmount() {
    toAmount.value = "";
  }

  fromAmount.addEventListener("input", clearToAmount);
  fromSelect.addEventListener("change", clearToAmount);
  toSelect.addEventListener("change", clearToAmount);
};

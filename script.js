(() => {
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("money-plus");
  const expenseEl = document.getElementById("money-minus");
  const historyList = document.getElementById("list");
  const formEl = document.getElementById("form");
  const textInput = document.getElementById("text");
  const amountInput = document.getElementById("amount");
  const notificationEl = document.getElementById("notification");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const saveToLocal = () =>
    localStorage.setItem("transactions", JSON.stringify(transactions));

  const notifyUser = () => {
    notificationEl.classList.add("show");
    setTimeout(() => notificationEl.classList.remove("show"), 2000);
  };

  const createId = () => crypto.getRandomValues(new Uint32Array(1))[0];

  const renderTransaction = ({ id, text, amount }) => {
    const type = amount < 0 ? "minus" : "plus";
    const sign = amount < 0 ? "-" : "+";

    const li = document.createElement("li");
    li.className = type;
    li.dataset.id = id;
    li.innerHTML = `
      ${text} <span>${sign}${Math.abs(amount)}</span>
      <button class="delete-btn"><i class="fa fa-times"></i></button>
    `;

    historyList.appendChild(li);
  };

  const renderSummary = () => {
    const amounts = transactions.map((tx) => tx.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts
      .filter((val) => val > 0)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);
    const expense = (
      amounts.filter((val) => val < 0).reduce((acc, val) => acc + val, 0) * -1
    ).toFixed(2);

    balanceEl.textContent = `$${total}`;
    incomeEl.textContent = `$${income}`;
    expenseEl.textContent = `$${expense}`;
  };

  const addTransaction = (e) => {
    e.preventDefault();

    const textVal = textInput.value.trim();
    const amountVal = amountInput.value.trim();

    if (!textVal || !amountVal) {
      notifyUser();
      return;
    }

    const newTransaction = {
      id: createId(),
      text: textVal,
      amount: +amountVal,
    };

    transactions.push(newTransaction);
    saveToLocal();
    renderTransaction(newTransaction);
    renderSummary();

    textInput.value = "";
    amountInput.value = "";
  };

  const removeTransaction = (id) => {
    transactions = transactions.filter((tx) => tx.id !== id);
    saveToLocal();
    loadTransactions();
  };

  const handleListClick = (e) => {
    if (e.target.closest(".delete-btn")) {
      const item = e.target.closest("li");
      const id = +item.dataset.id;
      removeTransaction(id);
    }
  };

  const loadTransactions = () => {
    historyList.innerHTML = "";
    transactions.forEach(renderTransaction);
    renderSummary();
  };

  form.addEventListener("submit", addTransaction);

  const clearBtn = document.getElementById("clear-history");

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all history?")) {
    transactions = [];
    saveToLocal();
    loadTransactions();
  }
});


  historyList.addEventListener("click", handleListClick);

  loadTransactions();
})();

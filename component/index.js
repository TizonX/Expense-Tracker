import { useState, useEffect, useRef } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [inputAmount, setInputAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategories, setCustomCategories] = useState([
    "Food",
    "Clothing",
    "Glossary",
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const listEndRef = useRef(null);
  const scrollButtonRef = useRef(null);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses"));
    if (storedExpenses) {
      setExpenses(storedExpenses);
    }
  }, []);

  useEffect(() => {
    if (expenses.length === 0) {
      const parseExpenses = localStorage.getItem("expenses");
      setExpenses(JSON.parse(parseExpenses));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollButtonRef.current) {
        scrollButtonRef.current.style.display =
          window.scrollY > 20 ? "block" : "none";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddExpense = () => {
    if (inputAmount.trim() !== "" && selectedCategory) {
      const formattedAmount = `₹${parseFloat(inputAmount).toFixed(2)}`;
      const expense = {
        amount: formattedAmount,
        category: selectedCategory,
      };
      setExpenses([...expenses, expense]);
      setInputAmount("");
      setErrorMessage("");
      localStorage.setItem("expenses", JSON.stringify([...expenses, expense]));
    } else {
      setErrorMessage("Please select a category.");
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddExpense();
    }
  };

  const handleAmountClick = (amount) => {
    setInputAmount(amount.replace("₹", ""));
    setSelectedCategory("");
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setErrorMessage("");
  };

  const handleAddCustomCategory = () => {
    const category = prompt("Enter custom category name:");
    if (category && category.trim() !== "") {
      setCustomCategories([...customCategories, category.trim()]);
    }
  };

  const handleDeleteCategory = (category) => {
    setCustomCategories(customCategories.filter((item) => item !== category));
  };

  const handleShowCategoryExpenses = () => {
    const categoryExpenses = {};
    expenses.forEach((expense) => {
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = parseFloat(
          expense.amount.replace("₹", "")
        );
      } else {
        categoryExpenses[expense.category] += parseFloat(
          expense.amount.replace("₹", "")
        );
      }
    });
    alert(JSON.stringify(categoryExpenses, null, 2));
  };

  const handleScrollToBottom = () => {
    listEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="expense-tracker-container">
      <h1 className="heading">Expense Tracker</h1>
      <div className="expenses-list">
        <ul>
          {expenses?.map((expense, index) => (
            <li key={index} className="expense-item">
              <span
                className="amount"
                onClick={() => handleAmountClick(expense.amount)}
              >
                {expense.amount}
              </span>
              <span className="list-category">{expense.category}</span>
              <button
                className="delete-expense"
                onClick={() => handleDeleteExpense(index)}
              >
                &times;
              </button>
            </li>
          ))}
          <div ref={listEndRef}></div>
        </ul>
        <button
          ref={scrollButtonRef}
          className="scroll-to-bottom"
          onClick={handleScrollToBottom}
        >
          &#9660;
        </button>
      </div>
      <div className="category-container">
        <div className="categories">
          {[...customCategories].map((category) => (
            <span
              key={category}
              className={`category ${
                selectedCategory === category ? "selected" : ""
              }`}
              onClick={() => handleSelectCategory(category)}
            >
              {category}
              <button
                className="delete-category"
                onClick={() => handleDeleteCategory(category)}
              >
                &times;
              </button>
            </span>
          ))}
          <button
            className="add-custom-category"
            onClick={handleAddCustomCategory}
          >
            +
          </button>
        </div>
      </div>
      <div className="input-container">
        <input
          type="number"
          className="amount-input"
          placeholder="Enter Amount"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-expense-button" onClick={handleAddExpense}>
          +
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* <button
        className="show-category-expenses"
        onClick={handleShowCategoryExpenses}
      >
        Show Category Expenses
      </button> */}
    </div>
  );
};

export default ExpenseTracker;

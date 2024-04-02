import { useState, useEffect, useRef } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [inputAmount, setInputAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategories, setCustomCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const listEndRef = useRef(null);
  const scrollButtonRef = useRef(null);

  useEffect(() => {
    listEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [expenses]);

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
      setExpenses([expense, ...expenses]);
      setInputAmount("");
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a category.");
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
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
      <h1>Expense Tracker</h1>
      <div className="category-container">
        <div className="categories">
          {["Food", "Clothing", "Glossary", ...customCategories].map(
            (category) => (
              <span
                key={category}
                className={selectedCategory === category ? "selected" : ""}
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
            )
          )}
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
          placeholder="Enter Amount"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="expenses-list">
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              <span onClick={() => handleAmountClick(expense.amount)}>
                {expense.amount}
              </span>
              <span>{expense.category}</span>
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
      <button
        className="show-category-expenses"
        onClick={handleShowCategoryExpenses}
      >
        Show Category Expenses
      </button>

      <style jsx>{`
        .expense-tracker-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-family: Arial, sans-serif;
          position: relative;
          background-color: #d3d3d3;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .category-container {
          margin-bottom: 20px;
        }

        .categories {
          display: flex;
          overflow-x: auto;
          margin-bottom: 10px;
        }

        .categories span {
          position: relative;
          cursor: pointer;
          padding: 8px 15px;
          background-color: #008080;
          color: #fff;
          border-radius: 20px;
          margin-right: 10px;
          font-size: 14px;
          white-space: nowrap;
        }

        .categories span.selected {
          background-color: #90e4c1;
        }

        .delete-category {
          position: absolute;
          top: 50%;
          right: -8px;
          transform: translateY(-50%);
          background-color: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
        }

        .add-custom-category {
          cursor: pointer;
          padding: 8px 15px;
          background-color: #008080;
          color: #fff;
          border: none;
          border-radius: 20px;
          margin-left: 10px;
          font-size: 16px;
          position: fixed;
          top: 20px;
        }

        .add-custom-category:hover {
          background-color: #90e4c1;
        }

        .input-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        input[type="number"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px;
          flex: 1;
        }

        button {
          padding: 10px 20px;
          background-color: #008080;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #90e4c1;
        }

        .expenses-list {
          max-height: 300px;
          overflow-y: auto;
          position: relative;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ccc;
          padding: 10px 0;
        }

        .delete-expense {
          background-color: #008080;
          color: #fff;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .delete-expense:hover {
          background-color: #90e4c1;
        }

        .show-category-expenses {
          display: block;
          margin: 20px auto 0;
        }

        .error-message {
          color: red;
          margin-top: 5px;
          font-size: 14px;
        }

        .scroll-to-bottom {
          position: absolute;
          bottom: calc(100% + 20px);
          left: 50%;
          transform: translateX(-50%);
          background-color: #008080;
          color: #fff;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: none;
        }

        .scroll-to-bottom:hover {
          background-color: #90e4c1;
        }
      `}</style>
    </div>
  );
};

export default ExpenseTracker;

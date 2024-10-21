"use client";
import React, { useState } from "react";
import ExpenseCategory from "./(expense)/ExpenseCategory";
import IncomeSource from "./IncomeSource";

function Category() {
  const [isExpense, setIsExpense] = useState(true);

  const toggleCategory = () => {
    setIsExpense(!isExpense);
  };
  return (
    <div className="pr-5">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <span
            className={`cursor-pointer text-lg font-medium ${
              isExpense ? "text-primary-600 font-semibold" : "text-gray-500"
            }`}
          >
            Expense
          </span>
          <div className="relative">
            <input
              type="checkbox"
              id="toggle"
              className="hidden"
              onChange={toggleCategory}
            />
            <label
              htmlFor="toggle"
              className={`flex items-center justify-between w-16 h-8 bg-primary-300 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isExpense ? "justify-start" : "justify-end"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isExpense ? "" : "transform translate-x-8"
                }`}
              ></span>
            </label>
          </div>
          <span
            className={`cursor-pointer text-lg font-medium ${
              isExpense ? "text-gray-600" : "text-primary-600 font-semibold"
            }`}
          >
            Income
          </span>
        </div>
        <div className=" w-full">
          {isExpense ? <ExpenseCategory /> : <IncomeSource />}
        </div>
      </div>
    </div>
  );
}

export default Category;

"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ExpenseCategory from "./(expense)/ExpenseCategory";
import IncomeSource from "./(income)/IncomeSource";

function Category() {
  const [isExpense, setIsExpense] = useState(true);
  const searchParams = useSearchParams();
  const toggleCategory = () => {
    setIsExpense(!isExpense);
  };

  useEffect(() => {
    if (searchParams.size > 0) {
      if (searchParams.get("isexpense") == "false") setIsExpense(false);
    }
  }, [searchParams]);
  return (
    <div className="pr-5">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <span
            className={`cursor-pointer text-base font-medium ${
              isExpense ? "text-primary-600 font-semibold" : "text-gray-500"
            }`}
          >
            Expense
          </span>
          <div className="relative">
            <input type="checkbox" id="toggle" className="hidden" onChange={toggleCategory} />
            <label
              htmlFor="toggle"
              className={`flex items-center justify-between w-14 h-7 bg-primary-300 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isExpense ? "justify-start" : "justify-end"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isExpense ? "" : "transform translate-x-7"
                }`}
              ></span>
            </label>
          </div>
          <span
            className={`cursor-pointer text-base font-medium ${
              isExpense ? "text-gray-600" : "text-primary-600 font-semibold"
            }`}
          >
            Income
          </span>
        </div>
      </div>
      <div className="w-full">{isExpense ? <ExpenseCategory /> : <IncomeSource />}</div>
    </div>
  );
}

export default Category;

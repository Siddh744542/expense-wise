import React from "react";

function formatData(expenseData, incomeData) {
  const totalExpenses = expenseData?.totalExpenses || 0;
  const categoryExpenses = expenseData?.categoryExpenses || [];

  const mostSpentCategory = categoryExpenses.reduce(
    (max, category) =>
      category?.amount > max.amount
        ? {
            name: category.category,
            amount: category.amount,
            limit: category.limit,
          }
        : max,
    { name: "", amount: 0, limit: 0 }
  );

  mostSpentCategory.percentage = (
    (mostSpentCategory.amount / totalExpenses) *
    100
  ).toFixed(2);

  const totalIncome = incomeData?.totalIncome || 0;
  const sources = incomeData?.sources || [];

  const highestIncomeSource = sources.reduce(
    (max, source) =>
      source?.total > max.amount
        ? { name: source.source, amount: source.total }
        : max,
    { name: "", amount: 0 }
  );

  highestIncomeSource.percentage = (
    (highestIncomeSource.amount / totalIncome) *
    100
  ).toFixed(2);

  const savings = totalIncome - totalExpenses;

  return {
    totalExpenses,
    mostSpentCategory,
    totalIncome,
    highestIncomeSource,
    savings,
  };
}

const MonthlyOverview = ({ expenseData, incomeData }) => {
  const {
    totalExpenses,
    mostSpentCategory,
    totalIncome,
    highestIncomeSource,
    savings,
  } = formatData(expenseData, incomeData);
  return (
    <div className="bg-white p-6 shadow-md rounded-lg h-full">
      <h2 className="text-xl font-semibold text-primary-500 mb-4">
        Monthly Overview
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">Total Expenses</p>
            <p className="text-xl font-semibold text-red-500">
              ₹{totalExpenses}
            </p>
          </div>
          <div className="flex justify-between ">
            <p className="text-gray-600 font-medium">Most Spent</p>
            <div className="text-right items-center">
              <p className="text-lg font-semibold">{mostSpentCategory.name}</p>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                ₹{mostSpentCategory.amount} ({mostSpentCategory.percentage}%)
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">Total Income</p>
            <p className="text-xl font-semibold text-blue-500">
              ₹{totalIncome}
            </p>
          </div>
          <div className="flex justify-between ">
            <p className="text-gray-600 font-medium">Highest Source</p>
            <div className="text-right items-center">
              <p className="text-lg font-semibold">
                {highestIncomeSource.name}
              </p>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                ₹{highestIncomeSource.amount} ({highestIncomeSource.percentage}
                %)
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        <div className="flex justify-between items-center pt-2">
          <p className="text-gray-600 font-semibold text-lg">Savings</p>
          <p className="text-xl font-bold text-green-500">₹{savings}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOverview;

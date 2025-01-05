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
            limit: category.limit
          }
        : max,
    { name: "", amount: 0, limit: 0 }
  );

  mostSpentCategory.percentage = ((mostSpentCategory.amount / totalExpenses) * 100).toFixed(2);

  const totalIncome = incomeData?.totalIncome || 0;
  const sources = incomeData?.sources || [];

  const highestIncomeSource = sources.reduce(
    (max, source) =>
      source?.total > max.amount ? { name: source.source, amount: source.total } : max,
    { name: "", amount: 0 }
  );

  highestIncomeSource.percentage = ((highestIncomeSource.amount / totalIncome) * 100).toFixed(2);

  const savings = totalIncome - totalExpenses;

  return {
    totalExpenses,
    mostSpentCategory,
    totalIncome,
    highestIncomeSource,
    savings
  };
}

const MonthlyOverview = ({ expenseData, incomeData }) => {
  const { totalExpenses, mostSpentCategory, totalIncome, highestIncomeSource, savings } =
    formatData(expenseData, incomeData);

  const noExpenseData = !expenseData || totalExpenses === 0;
  const noIncomeData = !incomeData || totalIncome === 0;

  return (
    <div className="h-full flex flex-col gap-2 bg-white p-5 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-primary-500 mb-2">Monthly Overview</h2>

      {noExpenseData && noIncomeData ? (
        <p className="text-gray-600 text-sm text-center">No data available</p>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-sm font-semibold text-red-500">₹{totalExpenses}</p>
            </div>
            <div className="flex justify-between ">
              <p className="text-gray-600 text-sm font-medium">Most Spent</p>
              <div className="text-right items-center">
                <p className="text-sm font-semibold">{mostSpentCategory.name || "N/A"}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  ₹{mostSpentCategory.amount} ({mostSpentCategory.percentage}%)
                </p>
              </div>
            </div>
          </div>
          <hr className="border-gray-300" />
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm font-medium">Total Income</p>
              <p className="text-sm font-semibold text-blue-500">₹{totalIncome}</p>
            </div>
            <div className="flex justify-between ">
              <p className="text-gray-600 text-sm font-medium">Highest Source</p>
              <div className="text-right items-center">
                <p className="text-sm font-semibold">{highestIncomeSource.name || "N/A"}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  ₹{highestIncomeSource.amount} ({highestIncomeSource.percentage}%)
                </p>
              </div>
            </div>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between items-center ">
            <p className="text-gray-600 text-sm font-semibold">Savings</p>
            <p className="text-sm font-bold text-green-500">₹{savings}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyOverview;

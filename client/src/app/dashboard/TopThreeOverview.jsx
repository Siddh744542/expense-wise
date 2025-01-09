import React from "react";

function formatTopThreeData(expenseData, incomeData) {
  const totalExpenses = expenseData?.totalExpenses || 0;
  const totalIncome = incomeData?.totalIncome || 0;

  const topExpenseCategories =
    expenseData?.categoryExpenses
      ?.map((category) => ({
        category: category.category,
        amount: category.amount,
        percentage: ((category.amount / totalExpenses) * 100).toFixed(2)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3) || [];

  const topIncomeSources =
    incomeData?.sources
      ?.map((source) => ({
        source: source.source,
        total: source.total,
        percentage: ((source.total / totalIncome) * 100).toFixed(2)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3) || [];

  return { topExpenseCategories, topIncomeSources };
}
const TopThreeOverview = ({ expenseData, incomeData }) => {
  const { topExpenseCategories, topIncomeSources } = formatTopThreeData(expenseData, incomeData);

  const noExpenseData = !topExpenseCategories.length;
  const noIncomeData = !topIncomeSources.length;

  return (
    <div className="flex flex-col gap-2 bg-white p-5 shadow-md rounded-lg h-full">
      <h2 className="text-xl font-semibold text-primary-500">Top Categories & Sources</h2>

      {/* Top 3 Expense Categories */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-red-500">Top Expense Categories</h3>
        <div className="flex flex-col gap-0.5">
          {noExpenseData ? (
            <p className="text-gray-600 text-sm ">No data available</p>
          ) : (
            topExpenseCategories.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-gray-600 font-medium text-sm">{category.category}</p>
                <div className="text-right flex gap-1 items-center">
                  <p className="text-sm">₹{category.amount}</p>
                  <p className="text-xs text-gray-500">({category.percentage}%)</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Top 3 Income Sources */}
      <div className="flex flex-col">
        <h3 className="text-blue-500 text-sm">Top Income Sources</h3>
        <div className="flex flex-col gap-0.5">
          {noIncomeData ? (
            <p className="text-gray-600 text-sm ">No data available</p>
          ) : (
            topIncomeSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-gray-600 font-medium text-sm">{source.source}</p>
                <div className="text-right flex gap-1 items-center">
                  <p className="text-sm">₹{source.total}</p>
                  <p className="text-xs text-gray-500">({source.percentage}%)</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopThreeOverview;

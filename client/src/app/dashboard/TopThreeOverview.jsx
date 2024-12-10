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

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-500 mb-3">Top Categories & Sources</h2>

      {/* Top 3 Expense Categories */}
      <div className="space-y-2 mb-3">
        <h3 className="text-lg  text-red-500">Top Expense Categories</h3>
        {topExpenseCategories.map((category, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">{category.category}</p>
            <div className="text-right flex gap-1">
              <p className="text-base ">₹{category.amount}</p>
              <p className="text-sm text-gray-500">({category.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-300 mb-3" />

      {/* Top 3 Income Sources */}
      <div className="space-y-2">
        <h3 className="text-lg  text-blue-500">Top Income Sources</h3>
        {topIncomeSources.map((source, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">{source.source}</p>
            <div className="text-right flex gap-1">
              <p className="text-base  ">₹{source.total}</p>
              <p className="text-sm text-gray-500">({source.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopThreeOverview;

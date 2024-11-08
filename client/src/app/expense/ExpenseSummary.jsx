import React from "react";

function getExpenseColor(expense, limit) {
  const percentage = (expense / limit) * 100;

  if (percentage <= 10) {
    return "bg-progress-100"; // 0-10% of limit used
  } else if (percentage <= 20) {
    return "bg-progress-200"; // 10-20% of limit used
  } else if (percentage <= 35) {
    return "bg-progress-300"; // 20-35% of limit used
  } else if (percentage <= 50) {
    return "bg-progress-400"; // 35-50% of limit used
  } else if (percentage <= 65) {
    return "bg-progress-500"; // 50-65% of limit used
  } else if (percentage <= 80) {
    return "bg-progress-600"; // 65-80% of limit used
  } else if (percentage <= 90) {
    return "bg-progress-700"; // 80-90% of limit used
  } else if (percentage <= 100) {
    return "bg-progress-800"; // 90-100% of limit used
  } else {
    return "bg-progress-900"; // Over limit
  }
}

function ExpenseSummary({ summaryData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-auto">
      <div className="space-y-2">
        {/* Total Expenses */}
        <div className="space-y-2">
          <div className="text-primary-600 font-semibold text-xl flex justify-between">
            Total Expenses:
            <div className="text-action font-bold text-2xl">
              ₹{summaryData?.totalExpenses || 0}
            </div>
          </div>
        </div>

        {/* Category Expenses */}
        <div className="space-y-2">
          {summaryData?.categoryExpenses?.length > 0 ? (
            summaryData.categoryExpenses.map((categoryExpense, index) => (
              <div
                key={categoryExpense._id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                {/* Category Info */}
                <div>
                  <p className="text-gray-600 font-semibold font-md">
                    {categoryExpense.category}
                  </p>
                  <div className="text-gray-500 flex gap-1">
                    Spent:
                    <p className="text-black">₹{categoryExpense.amount}</p>
                  </div>
                </div>
                {/* Limit with dynamic color */}
                <div
                  className={`${getExpenseColor(
                    categoryExpense.amount,
                    categoryExpense.limit
                  )}  text-white rounded-full px-4 py-1`}
                >
                  Limit: ₹{categoryExpense.limit}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No category expenses available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;

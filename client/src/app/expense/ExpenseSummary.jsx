import React from "react";

function ExpenseSummary({ summaryData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-auto">
      <div className="space-y-2">
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
            summaryData?.categoryExpenses.map((categoryExpense) => (
              <div
                key={categoryExpense?._id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                <div>
                  <p className="text-gray-600 font-semibold font-md">
                    {categoryExpense?.category}
                  </p>
                  <div className="text-gray-500 flex gap-1">
                    Spent:
                    <p className="text-black">₹{categoryExpense?.amount}</p>
                  </div>
                </div>
                <div className="bg-gray-100 text-gray-600 rounded-full px-4 py-1">
                  Limit: ₹{categoryExpense?.limit}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No category expenses available</p>
          )}
        </div>
      </div>

      {/* {error && <p className="text-red-500">{error}</p>} */}
    </div>
  );
}

export default ExpenseSummary;

import React from "react";
import { getExpenseColor } from "@/helper/GetExpenseColor";
function ExpenseSummary({ summaryData }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow h-full">
      <div className="flex flex-col gap-2">
        {/* Total Expenses */}
        <div className="flex flex-col gap-2">
          <div className="text-primary font-semibold text-xl flex justify-between">
            Total Expenses:
            <div className="text-action font-bold text-xl">₹{summaryData?.totalExpenses || 0}</div>
          </div>
        </div>

        {/* Category Expenses */}
        <div className="flex flex-col overflow-y-auto h-[11rem]">
          {summaryData?.categoryExpenses?.length > 0 ? (
            summaryData.categoryExpenses.map((categoryExpense, index) => (
              <div key={categoryExpense._id} className="pr-2">
                <div className="flex justify-between items-center">
                  {/* Category Info */}
                  <div>
                    <p className="text-gray-700 text-sm">{categoryExpense.category}</p>
                    <div className="text-gray-500 flex text-xs gap-1">
                      Spent :<p className="text-black">₹{categoryExpense.amount}</p>
                    </div>
                  </div>
                  {/* Limit with dynamic color */}
                  <div className={`flex text-sm items-center gap-1`}>
                    <p className="text-xs text-gray-500">Limit :</p>
                    <p
                      className={`${getExpenseColor(
                        categoryExpense.amount,
                        categoryExpense.limit
                      )} text-white rounded-full px-2 py-0.5 text-xs`}
                    >
                      ₹{categoryExpense.limit}
                    </p>
                  </div>
                </div>
                {index < summaryData.categoryExpenses.length - 1 && (
                  <hr className="border-gray-300 my-1" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No expenses </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;

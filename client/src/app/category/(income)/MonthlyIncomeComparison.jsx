import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
function MonthlyIncomeComparison({ comparisonData }) {
  return (
    <div className="flex flex-col gap-1.5 bg-white p-5 shadow-md rounded-lg">
      <div className="">
        <h2 className="text-xl text-primary-500 font-semibold">Source Comparison</h2>
        <p className="text-sm text-gray-400">This Month vs Last Month</p>
      </div>
      <div className="flex flex-col overflow-y-auto h-[12rem]">
        {comparisonData?.length > 0 ? (
          comparisonData?.map((item, index) => (
            <div key={index} className="pr-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-700 font-semibold">{item.source}</h3>
                  <p className="text-gray-500 text-sm">Last month: ₹{item.lastMonth}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{item.thisMonth}</p>
                  <div
                    className={`flex items-center justify-end ${
                      item.thisMonth >= item.lastMonth ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.thisMonth >= item.lastMonth ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    <span className="ml-1 text-xs">
                      {Math.abs(((item.thisMonth - item.lastMonth) / item.lastMonth) * 100).toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
              {index < comparisonData.length - 1 && <hr className="border-gray-300 my-1" />}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-sm">No data available</p>
        )}
      </div>
    </div>
  );
}
export default MonthlyIncomeComparison;

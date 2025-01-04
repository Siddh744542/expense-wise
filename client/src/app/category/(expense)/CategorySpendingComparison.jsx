import React, { useState, useEffect, use } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const CategorySpendingComparison = ({ comparisonData }) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!comparisonData) {
      setError("No data found");
    } else if (comparisonData.length === 0) {
      setError("No data found");
    } else {
      setError(null);
    }
  }, [comparisonData]);
  return (
    <div className="h-full flex flex-col gap-2 bg-white p-5 shadow-md rounded-lg">
      <div className="">
        <h2 className="text-xl text-primary-500 font-semibold">Category Comparison</h2>
        <p className="text-sm text-gray-400">This Month vs Last Month</p>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col">
        {comparisonData?.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-gray-700 font-semibold">{item.category}</h3>
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
            {index < comparisonData.length - 1 && <hr className="border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySpendingComparison;

import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const CategorySpendingComparison = ({ comparisonData }) => {
  const [error, setError] = useState(null);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <div className="mb-3">
        <h2 className="text-xl text-primary-500 font-semibold">Category Comparison</h2>
        <p className="text-sm text-gray-400">This Month vs Last Month</p>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {comparisonData?.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-md text-gray-700 font-semibold">{item.category}</h3>
              <p className="text-gray-500">Last month: ₹{item.lastMonth}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">₹{item.thisMonth}</p>
              <div
                className={`flex items-center justify-end ${
                  item.thisMonth >= item.lastMonth ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.thisMonth >= item.lastMonth ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1">
                  {Math.abs(((item.thisMonth - item.lastMonth) / item.lastMonth) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {index < comparisonData.length - 1 && <hr className="my-2 border-gray-300" />}
        </div>
      ))}
    </div>
  );
};

export default CategorySpendingComparison;

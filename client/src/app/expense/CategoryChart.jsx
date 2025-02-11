"use client";
import React, { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartColors from "@/helper/ChartColors";
const aggregateCategoryData = (categoryExpenses) => {
  return categoryExpenses?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount
  }));
};

function CategoryChart({ summaryData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const aggregatedData = aggregateCategoryData(summaryData);

  return (
    <div className="h-full bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-primary">Expense By Category</h2>
      <div className="h-60">
        {aggregatedData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#888fd8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ChartColors[index % ChartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={-5} height={20} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-600 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;

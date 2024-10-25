"use client";
import React, { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartColors from "@/helper/ChartColors";
const aggregateCategoryData = (categoryExpenses) => {
  return categoryExpenses?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
  }));
};

function CategoryChart({ summaryData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const aggregatedData = aggregateCategoryData(summaryData);

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-primary">
        Expense By Category
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            label
            outerRadius={120}
            fill="#888fd8"
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {aggregatedData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ChartColors[index % ChartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;

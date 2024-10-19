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

const aggregateCategoryData = (categoryExpenses) => {
  return categoryExpenses?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
  }));
};

const chartColor = [
  "#004B95",
  "#4CB140",
  "#F0AB00",
  "#A30000",
  "#519DE9",
  "#EC7A08",
  "#f00757",
  "#009596",
  "#5752D1",
  "#3c5c04",
  "#ca3220",
];

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
                fill={chartColor[index % chartColor.length]}
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

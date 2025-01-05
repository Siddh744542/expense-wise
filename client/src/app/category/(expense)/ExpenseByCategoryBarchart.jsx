"use client";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartColors from "@/helper/ChartColors";

const aggregateCategoryData = (categoryData) => {
  if (!categoryData) return [];
  return categoryData?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    fill: ChartColors[index % ChartColors.length]
  }));
};
function ExpenseByCategoryBarchart({ expenseCategoryData }) {
  const aggregateData = aggregateCategoryData(expenseCategoryData);
  return (
    <div className="h-full bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-xl text-primary font-semibold pb-2">Monthly Expenses by Category</h2>
      <div className={`flex-grow h-60`}>
        {aggregateData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregateData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-600">No category expenses available</p>
        )}
      </div>
    </div>
  );
}

export default ExpenseByCategoryBarchart;

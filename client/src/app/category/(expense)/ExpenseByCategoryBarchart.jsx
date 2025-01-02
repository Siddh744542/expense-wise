"use client";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartColors from "@/helper/ChartColors";

const aggregateCategoryData = (categoryData) => {
  return categoryData?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    fill: ChartColors[index % ChartColors.length]
  }));
};
function ExpenseByCategoryBarchart({ expenseCategoryData }) {
  const aggregatedData = aggregateCategoryData(expenseCategoryData);
  return (
    <div className="h-full bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-xl text-primary font-semibold pb-2 px-2">Monthly Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={aggregatedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseByCategoryBarchart;

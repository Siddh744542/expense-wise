"use client";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartColors from "@/helper/ChartColors";

const aggregateCategoryData = (categoryData) => {
  return categoryData?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    fill: ChartColors[index % ChartColors.length],
  }));
};
function ExpenseByCategoryBarchart({ expenseCategoryData }) {
  const aggregatedData = aggregateCategoryData(expenseCategoryData);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={aggregatedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExpenseByCategoryBarchart;

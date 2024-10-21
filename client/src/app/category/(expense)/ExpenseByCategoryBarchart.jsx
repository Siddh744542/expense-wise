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
const chartColor = [
  "#f45655",
  "#7da7d9",
  "#F1C02B",
  "#D09C9C",
  "#8EB3D3",
  "#F1B13D",
  "#F2A6B1",
  "#8BC3C3",
  "#A5A1E1",
  "#A4C6A4",
  "#D78A7A",
  ,
  ,
];
const aggregateCategoryData = (categoryData) => {
  return categoryData?.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    fill: chartColor[index % chartColor.length], // Assign color from array
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

"use client";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartColors from "@/helper/ChartColors";

const aggregateSourceData = (incomeSourceData) => {
  return incomeSourceData?.map((source, index) => ({
    name: source.source,
    value: source.total,
    fill: ChartColors[index % ChartColors.length],
  }));
};
function IncomeBySourceBarchart({ incomeSourceData }) {
  const aggregatedData = aggregateSourceData(incomeSourceData);
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

export default IncomeBySourceBarchart;

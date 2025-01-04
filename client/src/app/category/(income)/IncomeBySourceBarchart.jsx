"use client";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartColors from "@/helper/ChartColors";

const aggregateSourceData = (incomeSourceData) => {
  return incomeSourceData?.map((source, index) => ({
    name: source.source,
    value: source.total,
    fill: ChartColors[index % ChartColors.length]
  }));
};
function IncomeBySourceBarchart({ incomeSourceData }) {
  const aggregatedData = aggregateSourceData(incomeSourceData);
  return (
    <div className="bg-white p-4 shadow-md rounded-lg h-full ">
      <h2 className="text-lg text-primary font-semibold pb-2">Monthly Income by Source</h2>
      <div className="flex-grow h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={aggregatedData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeBySourceBarchart;

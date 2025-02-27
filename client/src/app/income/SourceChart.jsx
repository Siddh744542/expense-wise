"use client";
import React, { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartColors from "@/helper/ChartColors";
const aggregateSourceData = (sourceIncomes) => {
  return sourceIncomes?.map((income, index) => ({
    name: income.source,
    value: income.total
  }));
};

function SourceChart({ summaryData, isCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const aggregatedData = aggregateSourceData(summaryData);

  return (
    <div className="flex flex-col bg-white p-5 rounded-lg shadow-md h-full">
      <h2 className="text-lg font-semibold text-primary">Income by Source</h2>
      <div className={`${isCategory ? "h-52" : "h-60"}`}>
        {aggregatedData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                outerRadius={isCategory ? 80 : 100}
                fill="#888fd8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ChartColors[index % ChartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={0} height={20} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-gray-600">No Data available</div>
        )}
      </div>
    </div>
  );
}

export default SourceChart;

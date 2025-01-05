import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Legend } from "recharts";

import ChartColors from "@/helper/ChartColors";

const formatRadialBarData = (categoryData) => {
  if (!categoryData) return [];

  const formattedData = categoryData.map((category, index) => {
    const { category: categoryName, amount, limit } = category;
    const percentage = ((amount / limit) * 100).toFixed(2);

    return {
      name: categoryName,
      spent: Number(percentage),
      fill: ChartColors[index % ChartColors.length],
      amount,
      limit
    };
  });

  formattedData.unshift({
    name: "i",
    spent: 100,
    fill: "transparent"
  });

  return formattedData;
};

const CategorySpendingRadialChart = ({ categoryData, isCategoryPage }) => {
  if (!categoryData) return <p className="text-gray-600">No category expenses available</p>;
  const radialBarData = formatRadialBarData(categoryData);
  return (
    <div className="h-full bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg text-primary-500 font-semibold text-left pl-1">
        Spending Limit Reached per Category
      </h2>
      <div className={`${isCategoryPage ? "h-56" : "h-52"} flex-grow`}>
        {radialBarData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="44%"
              innerRadius="5%"
              outerRadius="105%"
              barSize={16}
              data={radialBarData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: "#f3f4f6" }}
                clockWise
                dataKey="spent"
                label={{
                  position: "insideStart",
                  fill: "#ffff",
                  formatter: (value) => (value !== 100 ? `${value}%` : ""),
                  fontSize: 12
                }}
              />
              <Tooltip
                formatter={(value, name, props) => [
                  name !== "i"
                    ? `${props.payload.amount} / ${props.payload.limit} (${value}%)`
                    : "",
                  name
                ]}
              />
              <Legend iconSize={0} layout="horizontal" verticalAlign="bottom" align="center" />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-600">No category expenses available</p>
        )}
      </div>
    </div>
  );
};

export default CategorySpendingRadialChart;

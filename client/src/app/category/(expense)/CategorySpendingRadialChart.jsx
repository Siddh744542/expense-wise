import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
      limit,
    };
  });

  formattedData.unshift({
    name: "Max",
    spent: 100,
    fill: "transparent",
  });

  return formattedData;
};

const CategorySpendingRadialChart = ({ categoryData }) => {
  const radialBarData = formatRadialBarData(categoryData);

  return (
    <div className="">
      <h2 className="text-xl text-primary-500 font-semibold text-center ">
        Spending by Category
      </h2>
      <div className="h-72 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="5%"
            outerRadius="90%"
            barSize={15}
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
                fill: "#fff",
                formatter: (value) => (value !== 100 ? `${value}%` : ""),
                fontSize: 14,
              }}
            />
            <Tooltip
              formatter={(value, name, props) => [
                name !== "Max"
                  ? `${props.payload.amount} / ${props.payload.limit} (${value}%)`
                  : "",
                name,
              ]}
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategorySpendingRadialChart;

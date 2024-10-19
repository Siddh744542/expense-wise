"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Categories from "./Categories";

function ExpenseCategory() {
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState();
  const router = useRouter();

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`,
        {
          params: { userId: session?.user.id },
        }
      );
      setCategoryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategory();
  }, [session]);
  // if (!summaryData) return <div>Loading...</div>;
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {/* Top Left: Total Spent (smaller) */}
      <div className="col-span-2">
        <Categories categoryData={categoryData} />
      </div>

      {/* Top Right: Bar chart of monthly expenses (larger) */}
      <div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Monthly Expenses by Category</h2>
        {/* Add your Bar chart component here */}
        <div className="mt-4">
          <label
            htmlFor="month-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Select Month
          </label>
          <select
            id="month-filter"
            className="mt-2 p-2 border border-gray-300 rounded"
          >
            <option>January</option>
            <option>February</option>
            {/* More months */}
          </select>
        </div>
      </div>

      {/* Bottom Left: Monthly trends (larger) */}
      <div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Monthly Trends</h2>
        {/* Add your Monthly Trends bar chart here */}
        <p>Chart goes here</p>
      </div>

      {/* Bottom Right: Top categories comparison (smaller) */}
      <div className="col-span-2 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Top Categories Comparison</h2>
        <p>This month: XYZ (XX%)</p>
        <p>Last month: XYZ (XX%)</p>
        <p>Difference: +/- XX%</p>
      </div>
    </div>
  );
}

export default ExpenseCategory;

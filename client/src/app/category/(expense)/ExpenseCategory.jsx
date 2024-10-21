"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Categories from "./Categories";
import ExpenseByCategoryBarchart from "./ExpenseByCategoryBarchart";

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
  return (
    <div className="pr-4">
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-3xl font-semibold text-primary">
          Category Overview
        </h1>
        <button
          className="bg-action text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
          onClick={() => router.push("/category/addcategory")}
        >
          Add Categories
        </button>
      </div>

      <div className="grid grid-cols-5 auto-rows-fr gap-4 ">
        <div className="col-span-2">
          <Categories categoryData={categoryData} />
        </div>

        <div className="h-full col-span-3 bg-white p-4 shadow-md rounded-lg justify-between">
          <h2 className="text-lg text-primary font-semibold pb-2">
            Monthly Expenses by Category
          </h2>
          <ExpenseByCategoryBarchart
            expenseCategoryData={categoryData?.categoryExpenses}
          />
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
    </div>
  );
}

export default ExpenseCategory;

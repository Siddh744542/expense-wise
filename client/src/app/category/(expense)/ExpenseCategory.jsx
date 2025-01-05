"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Categories from "./Categories";
import ExpenseByCategoryBarchart from "./ExpenseByCategoryBarchart";
import CategorySpendingRadialChart from "./CategorySpendingRadialChart";
import CategorySpendingComparison from "./CategorySpendingComparison";
import { Loader } from "@/app/dashboardWrapper";
import MonthFilter from "@/app/(components)/MonthFilter";
import { getExpenseCategoryData } from "@/api/query/category/expenseCategoryQuery";

function ExpenseCategory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const [expenseCategoryData, isLoadingCategory, refetch] = getExpenseCategoryData(
    session?.user?.id,
    selectedMonth
  );

  if (selectedMonth === null || isLoadingCategory) return <Loader />;
  return (
    <div>
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Category Overview</h1>
        <div className="flex gap-4">
          <MonthFilter selectedMonth={selectedMonth} />

          <button
            className="bg-action text-sm text-white px-2 py-1 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/category/addcategory")}
          >
            Add Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 py-2">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Categories */}
          <div className="lg:col-span-2">
            <Categories categoryData={expenseCategoryData?.summaryData} refetch={refetch} />
          </div>
          {/* Expense By Category Bar Chart */}
          <div className="lg:col-span-3">
            <ExpenseByCategoryBarchart
              expenseCategoryData={expenseCategoryData?.summaryData?.categoryExpenses}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Category Spending Radial Chart */}
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <CategorySpendingRadialChart
              categoryData={expenseCategoryData?.summaryData?.categoryExpenses}
              isCategoryPage={true}
            />
          </div>
          {/* Category Spending Comparison */}
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <CategorySpendingComparison comparisonData={expenseCategoryData?.comparisonData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCategory;

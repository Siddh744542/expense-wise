"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Categories from "./Categories";
import ExpenseByCategoryBarchart from "./ExpenseByCategoryBarchart";
import formatMonth from "@/helper/formatMonth";
import CategorySpendingRadialChart from "./CategorySpendingRadialChart";
import CategorySpendingComparison from "./CategorySpendingComparison";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableMonths } from "@/app/expense/page";
import { Loader } from "@/app/dashboardWrapper";

const fetchCategoryData = async (userId, month) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/category`, {
    params: { userId, month }
  });
  return response.data;
};
function ExpenseCategory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", session?.user?.id],
    queryFn: () => fetchAvailableMonths(session?.user?.id),
    enabled: !!session?.user?.id
  });

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    refetch
  } = useQuery({
    queryKey: ["categoryData", session?.user?.id, selectedMonth],
    queryFn: () => fetchCategoryData(session?.user?.id, selectedMonth),
    enabled: !!session?.user?.id && !!selectedMonth
  });

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };

  if (isLoadingMonths || isLoadingCategory) return <Loader />;
  return (
    <div className="">
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Category Overview</h1>
        <div className="flex gap-4">
          <div>
            <label htmlFor="date-filter" className="mr-2 text-sm font-medium">
              Date:
            </label>
            <select
              id="date-filter"
              className="border text-sm rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleMonthChange}
              value={selectedMonth || ""}
            >
              <option value="">Select Month</option>
              {availableMonths?.length > 0 ? (
                availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))
              ) : (
                <option disabled>No months available</option>
              )}
            </select>
          </div>

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
            <Categories categoryData={categoryData?.summaryData} refetch={refetch} />
          </div>
          {/* Expense By Category Bar Chart */}
          <div className="lg:col-span-3">
            <ExpenseByCategoryBarchart
              expenseCategoryData={categoryData?.summaryData?.categoryExpenses}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Category Spending Radial Chart */}
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <CategorySpendingRadialChart
              categoryData={categoryData?.summaryData?.categoryExpenses}
              categoryPage={true}
            />
          </div>
          {/* Category Spending Comparison */}
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <CategorySpendingComparison comparisonData={categoryData?.comparisonData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCategory;

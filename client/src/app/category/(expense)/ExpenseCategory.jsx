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
    <div className="pr-4">
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-3xl font-semibold text-primary">Category Overview</h1>
        <div className="flex gap-2 items-center">
          <div>
            <label htmlFor="date-filter" className="mr-2 font-medium">
              Date:
            </label>
            <select
              id="date-filter"
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="bg-action text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/category/addcategory")}
          >
            Add Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <Categories categoryData={categoryData?.summaryData} refetch={refetch} />
        </div>

        <div className="h-full col-span-1 lg:col-span-3 ">
          <ExpenseByCategoryBarchart
            expenseCategoryData={categoryData?.summaryData?.categoryExpenses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="h-full col-span-1 md:col-span-2 lg:col-span-2 ">
          <CategorySpendingRadialChart categoryData={categoryData?.summaryData?.categoryExpenses} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 ">
          <CategorySpendingComparison comparisonData={categoryData?.comparisonData} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseCategory;

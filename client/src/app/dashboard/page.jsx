"use client";
import React, { useEffect, useState } from "react";
import CategorySpendingRadialChart from "../category/(expense)/CategorySpendingRadialChart";
import { useSession } from "next-auth/react";
import axios from "axios";
import MonthlyOverview from "./MonthlyOverview";
import TopThreeOverview from "./TopThreeOverview";
import ExpenseByCategoryBarchart from "../category/(expense)/ExpenseByCategoryBarchart";
import CategorySpendingComparison from "../category/(expense)/CategorySpendingComparison";
import { useRouter, useSearchParams } from "next/navigation";
import formatMonth from "@/helper/formatMonth";
import { fetchAvailableMonths } from "../expense/page";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../dashboardWrapper";

export const fetchDashboardData = async (userId, month) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`, {
    params: { userId, month }
  });
  return response.data;
};
function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };
  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", session?.user?.id],
    queryFn: () => fetchAvailableMonths(session?.user?.id),
    enabled: !!session?.user?.id
  });

  const { data: dashbaordData, isLoading: isLoadingDashboardData } = useQuery({
    queryKey: ["dashboardData", session?.user?.id, selectedMonth],
    queryFn: () => fetchDashboardData(session?.user?.id, selectedMonth),
    enabled: !!session?.user?.id && !!selectedMonth
  });

  if (isLoadingMonths || isLoadingDashboardData) {
    return <Loader />;
  }

  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <div className="flex space-x-4">
          {/* Date Filter */}
          <div>
            <label htmlFor="date-filter" className="mr-2 text-sm font-medium">
              Date:
            </label>
            <select
              id="date-filter"
              className="border text-sm rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              <option value="">Select Month</option>
              {availableMonths?.length > 0 ? (
                availableMonths?.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))
              ) : (
                <option disabled>No months available</option>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-5 py-1">
        <div className="col-span-10 md:col-span-3">
          <MonthlyOverview
            expenseData={dashbaordData?.expenseData}
            incomeData={dashbaordData?.incomeData}
          />
        </div>

        <div className="col-span-10 md:col-span-3">
          <TopThreeOverview
            expenseData={dashbaordData?.expenseData}
            incomeData={dashbaordData?.incomeData}
          />
        </div>

        <div className="col-span-10 md:col-span-4">
          <CategorySpendingRadialChart
            categoryData={dashbaordData?.expenseData?.categoryExpenses}
          />
        </div>

        <div className="col-span-10 md:col-span-5">
          <ExpenseByCategoryBarchart
            expenseCategoryData={dashbaordData?.expenseData?.categoryExpenses}
          />
        </div>

        <div className="col-span-10 md:col-span-5">
          <CategorySpendingComparison comparisonData={dashbaordData?.comparisonData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

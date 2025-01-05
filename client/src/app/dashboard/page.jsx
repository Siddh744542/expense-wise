"use client";
import React, { useEffect, useState } from "react";
import CategorySpendingRadialChart from "../category/(expense)/CategorySpendingRadialChart";
import { useSession } from "next-auth/react";
import MonthlyOverview from "./MonthlyOverview";
import TopThreeOverview from "./TopThreeOverview";
import ExpenseByCategoryBarchart from "../category/(expense)/ExpenseByCategoryBarchart";
import CategorySpendingComparison from "../category/(expense)/CategorySpendingComparison";
import { useSearchParams } from "next/navigation";
import { Loader } from "../dashboardWrapper";
import MonthFilter from "../(components)/MonthFilter";
import { getDashboardData } from "@/api/query/dashboardquery";

function Dashboard() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const [dashbaordData, isLoadingDashboardData] = getDashboardData(
    session?.user?.id,
    selectedMonth
  );

  if (selectedMonth === null || isLoadingDashboardData) {
    return <Loader />;
  }

  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <div className="flex gap-4">
          {/* Date Filter */}
          <MonthFilter selectedMonth={selectedMonth} />
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

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import IncomeSummary from "./IncomeSummary";
import SourceChart from "./SourceChart";
import IncomeList from "./IncomeList";
import { Loader } from "../dashboardWrapper";
import MonthFilter from "../(components)/MonthFilter";
import { getIncomeSummary } from "@/react-query/query/incomeQuery";

function Income() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const [incomeSummaryData, isLoadingSummary] = getIncomeSummary(session?.user?.id, selectedMonth);

  if (selectedMonth === null || isLoadingSummary) return <Loader />;
  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Income Overview</h1>

        <div className="flex gap-4">
          {/* Date Filter */}
          <MonthFilter selectedMonth={selectedMonth} />

          <button
            className="bg-primary text-sm text-white px-2 py-1 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/income/addincome")}
          >
            Add Income
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 py-2">
        <div className="lg:col-span-2 grid gap-6">
          {/* Income Summary Section */}
          <IncomeSummary summaryData={incomeSummaryData} />
          {/* Pie Chart Section */}
          <SourceChart summaryData={incomeSummaryData?.sources} />
        </div>
        {/* Expense List Section */}
        <div className="lg:col-span-3">
          <IncomeList />
        </div>
      </div>
    </div>
  );
}

export default Income;

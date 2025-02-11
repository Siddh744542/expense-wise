"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ExpenseSummary from "./ExpenseSummary";
import CategoryChart from "./CategoryChart";
import { useRouter, useSearchParams } from "next/navigation";
import ExpenseList from "./ExpenseList";
import { Loader } from "../dashboardWrapper";
import MonthFilter from "../(components)/MonthFilter";
import { getExpenseSummary } from "@/react-query/query/expenseQuery";

function Expenses() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState();

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  // Fetch summary data
  const [expenseSummaryData, isLoadingSummary] = getExpenseSummary(
    session?.user?.id,
    selectedMonth
  );

  if (selectedMonth === null || isLoadingSummary) {
    return <Loader />;
  }

  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Expenses Overview</h1>

        <div className="flex gap-4">
          {/* Date Filter */}
          <MonthFilter selectedMonth={selectedMonth} />

          <button
            className="bg-action text-sm text-white px-2 py-1 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/expense/addexpense")}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 py-2">
        <div className="lg:col-span-2 grid grid-rows-1 gap-5">
          {/* Expense Summary Section */}
          <ExpenseSummary summaryData={expenseSummaryData} />
          {/* Pie Chart Section */}
          <CategoryChart summaryData={expenseSummaryData?.categoryExpenses} />
        </div>
        {/* Expense List Section */}
        <div className="lg:col-span-3">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}

export default Expenses;

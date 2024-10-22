"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ExpenseSummary from "./ExpenseSummary";
import CategoryChart from "./CategoryChart";
import { useRouter } from "next/navigation";
import ExpenseList from "./ExpenseList";
import formatMonth from "@/helper/formatMonth";

function Expenses() {
  const { data: session, status } = useSession();
  const [summaryData, setSummaryData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );
  const router = useRouter();

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setSummaryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSummary();
  }, [session, selectedMonth]);
  if (!summaryData) return <div>Loading...</div>;
  return (
    <div className="p-2 pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-semibold text-primary">
          Expenses Overview
        </h1>

        <div className="flex space-x-4">
          {/* Date Filter */}
          <div>
            <label htmlFor="date-filter" className="mr-2 font-medium">
              Date:
            </label>
            <select
              id="date-filter"
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              <option value="">Select Month</option>
              {summaryData?.availableMonths?.length > 0 ? (
                summaryData.availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))
              ) : (
                <option disabled>No months available</option>
              )}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="mr-2 font-medium">
              Category:
            </label>
            <select
              id="category-filter"
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <button
            className="bg-action text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/expense/addexpense")}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 grid grid-rows-1 gap-6">
          {/* Expense Summary Section */}
          <ExpenseSummary summaryData={summaryData} />
          {/* Pie Chart Section */}
          <CategoryChart summaryData={summaryData?.categoryExpenses} />
        </div>
        {/* Expense List Section */}
        <ExpenseList fetchSummary={fetchSummary} />
      </div>
    </div>
  );
}

export default Expenses;

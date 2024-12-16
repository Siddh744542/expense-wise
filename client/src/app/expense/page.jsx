"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ExpenseSummary from "./ExpenseSummary";
import CategoryChart from "./CategoryChart";
import { useRouter, useSearchParams } from "next/navigation";
import ExpenseList from "./ExpenseList";
import formatMonth from "@/helper/formatMonth";

function Expenses() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const initialMonth = searchParams.get("month");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const [summaryData, setSummaryData] = useState();
  const [availableMonths, setAvailableMonths] = useState();

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };

  const fetchAvailableMonth = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/getavailablemonths`,
        {
          params: { userId: session?.user.id }
        }
      );
      setAvailableMonths(response.data?.months);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setSummaryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchAvailableMonth();
  }, [session]);
  useEffect(() => {
    fetchSummary();
  }, [session, selectedMonth]);

  if (!summaryData) return <div>Loading...</div>;

  return (
    <div className=" pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2">
        <h1 className="text-3xl font-semibold text-primary">Expenses Overview</h1>

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

          <button
            className="bg-action text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/expense/addexpense")}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 py-4">
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

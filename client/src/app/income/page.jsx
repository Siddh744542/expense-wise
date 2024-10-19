"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import IncomeSummary from "./IncomeSummary";
import SourceChart from "./SourceChart";
import IncomeList from "./IncomeList";

function Income() {
  const { data: session, status } = useSession();
  const [summaryData, setSummaryData] = useState();
  const router = useRouter();
  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`,
        {
          params: { userId: session?.user.id },
        }
      );
      setSummaryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSummary();
  }, [session]);
  if (!summaryData) return <div>Loading...</div>;
  return (
    <div className="p-2 pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-semibold text-primary">Income Overview</h1>

        <div className="flex space-x-4">
          {/* Date Filter */}
          <div>
            <label htmlFor="date-filter" className="mr-2 font-medium">
              Date:
            </label>
            <select
              id="date-filter"
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* source Filter */}
          <div>
            <label htmlFor="source-filter" className="mr-2 font-medium">
              Source:
            </label>
            <select
              id="source-filter"
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Sources</option>
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            className="bg-action text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            onClick={() => router.push("/income/addincome")}
          >
            Add Income
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 grid grid-rows-1 gap-6">
          {/* Income Summary Section */}
          <IncomeSummary summaryData={summaryData} />
          {/* Pie Chart Section */}
          <SourceChart summaryData={summaryData?.sources} />
        </div>
        {/* Expense List Section */}
        <IncomeList fetchSummary={fetchSummary} />
      </div>
    </div>
  );
}

export default Income;

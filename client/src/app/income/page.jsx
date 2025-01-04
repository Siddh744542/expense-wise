"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import IncomeSummary from "./IncomeSummary";
import SourceChart from "./SourceChart";
import IncomeList from "./IncomeList";
import formatMonth from "@/helper/formatMonth";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableMonths } from "../expense/page";
import { Loader } from "../dashboardWrapper";

const fetchSummary = async ({ userId, month }) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`, {
    params: { userId, month }
  });
  return response.data;
};

function Income() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initialMonth = searchParams.get("month");
    setSelectedMonth(initialMonth);
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

  // Fetch summary data
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["incomeSummaryData", session?.user?.id, selectedMonth],
    queryFn: () => fetchSummary({ userId: session?.user?.id, month: selectedMonth }),
    enabled: !!session?.user?.id && !!selectedMonth
  });

  if (isLoadingMonths || isLoadingSummary) return <Loader />;
  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Income Overview</h1>

        <div className="flex gap-4">
          {/* Date Filter */}
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
            className="bg-action text-sm text-white px-2 py-1 rounded-md hover:bg-opacity-90 transition"
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
          <IncomeSummary summaryData={summaryData} />
          {/* Pie Chart Section */}
          <SourceChart summaryData={summaryData?.sources} />
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

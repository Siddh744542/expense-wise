"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import formatMonth from "@/helper/formatMonth";
import SourceSummary from "./SourceSummary";
import IncomeBySourceBarchart from "./IncomeBySourceBarchart";
import MonthlyIncomeComparison from "./MonthlyIncomeComparison";
import SourceChart from "@/app/income/SourceChart";
import { fetchAvailableMonths } from "@/app/expense/page";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/app/dashboardWrapper";

const fetchIncomeSourceData = async (userId, month) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource`, {
    params: { userId, month }
  });
  return response.data;
};

function IncomeSource() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
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
    data: IncomeSourceData,
    isLoading: isLoadingSource,
    refetch
  } = useQuery({
    queryKey: ["sourceData", session?.user?.id, selectedMonth],
    queryFn: () => fetchIncomeSourceData(session?.user?.id, selectedMonth),
    enabled: !!session?.user?.id && !!selectedMonth
  });

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };
  if (isLoadingMonths && isLoadingSource) return <Loader />;
  return (
    <div>
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Income Source</h1>
        <div className="flex gap-4">
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
            onClick={() => router.push("/category/addincomesource")}
          >
            Add Income Source
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2">
            <SourceSummary summaryData={IncomeSourceData?.summaryData} refetch={refetch} />
          </div>

          <div className="lg:col-span-3">
            <IncomeBySourceBarchart incomeSourceData={IncomeSourceData?.summaryData?.sources} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <SourceChart summaryData={IncomeSourceData?.summaryData?.sources} isCategory={true} />
          </div>

          <div className="md:col-span-2 lg:col-span-2 h-full ">
            <MonthlyIncomeComparison comparisonData={IncomeSourceData?.comparisonData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeSource;

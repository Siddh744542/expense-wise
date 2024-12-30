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
    <div className="pr-4">
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-3xl font-semibold text-primary">Income Source</h1>
        <div className="flex gap-2 items-center">
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
            onClick={() => router.push("/category/addincomesource")}
          >
            Add Income Source
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
        <div className="col-span-1 shadow-md lg:col-span-2">
          <SourceSummary summaryData={IncomeSourceData?.summaryData} refetch={refetch} />
        </div>

        <div className="h-full col-span-1 lg:col-span-3 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg text-primary font-semibold pb-2">Monthly Income by Source</h2>
          <IncomeBySourceBarchart incomeSourceData={IncomeSourceData?.summaryData?.sources} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="h-auto shadow-md col-span-1 md:col-span-2 lg:col-span-2">
          <SourceChart summaryData={IncomeSourceData?.summaryData?.sources} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white p-6 shadow-md rounded-lg">
          <MonthlyIncomeComparison comparisonData={IncomeSourceData?.comparisonData} />
        </div>
      </div>
    </div>
  );
}

export default IncomeSource;

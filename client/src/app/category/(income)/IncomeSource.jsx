"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SourceSummary from "./SourceSummary";
import IncomeBySourceBarchart from "./IncomeBySourceBarchart";
import MonthlyIncomeComparison from "./MonthlyIncomeComparison";
import SourceChart from "@/app/income/SourceChart";
import { Loader } from "@/app/dashboardWrapper";
import MonthFilter from "@/app/(components)/MonthFilter";
import { getIncomeSourceData } from "@/react-query/query/category/incomeSourceQuery";

function IncomeSource() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const [incomeSourceData, isLoadingSource, refetch] = getIncomeSourceData(
    session?.user?.id,
    selectedMonth
  );

  if (selectedMonth === null || isLoadingSource) return <Loader />;
  return (
    <div>
      <div className="flex justify-between items-center py-2 pt-0">
        <h1 className="text-2xl font-semibold text-primary">Income Source</h1>
        <div className="flex gap-4">
          <MonthFilter selectedMonth={selectedMonth} />

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
            <SourceSummary summaryData={incomeSourceData?.summaryData} refetch={refetch} />
          </div>

          <div className="lg:col-span-3">
            <IncomeBySourceBarchart incomeSourceData={incomeSourceData?.summaryData?.sources} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <SourceChart summaryData={incomeSourceData?.summaryData?.sources} isCategory={true} />
          </div>

          <div className="md:col-span-2 lg:col-span-2 h-full ">
            <MonthlyIncomeComparison comparisonData={incomeSourceData?.comparisonData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeSource;

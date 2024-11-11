"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import formatMonth from "@/helper/formatMonth";
import SourceSummary from "./SourceSummary";
import IncomeBySourceBarchart from "./IncomeBySourceBarchart";
import MonthlyIncomeComparison from "./MonthlyIncomeComparison";
import SourceChart from "@/app/income/SourceChart";

function IncomeSource() {
  const { data: session, status } = useSession();
  const [IncomeSourceData, setIncomeSourceData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );
  const router = useRouter();

  const fetchIncomeSource = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setIncomeSourceData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchIncomeSource();
  }, [session, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
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
              {IncomeSourceData?.availableMonths?.length > 0 ? (
                IncomeSourceData.availableMonths.map((month) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <SourceSummary
            summaryData={IncomeSourceData}
            selectedMonth={selectedMonth}
          />
        </div>

        <div className="h-full col-span-1 lg:col-span-3 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg text-primary font-semibold pb-2">
            Monthly Income by Source
          </h2>
          <IncomeBySourceBarchart
            incomeSourceData={IncomeSourceData?.sources}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="h-auto col-span-1 md:col-span-2 lg:col-span-2">
          <SourceChart summaryData={IncomeSourceData?.sources} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white p-6 shadow-md rounded-lg">
          <MonthlyIncomeComparison selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default IncomeSource;

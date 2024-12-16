"use client";
import React, { useState, useEffect } from "react";
import CategorySpendingRadialChart from "../category/(expense)/CategorySpendingRadialChart";
import { useSession } from "next-auth/react";
import axios from "axios";
import MonthlyOverview from "./MonthlyOverview";
import TopThreeOverview from "./TopThreeOverview";
import ExpenseByCategoryBarchart from "../category/(expense)/ExpenseByCategoryBarchart";
import CategorySpendingComparison from "../category/(expense)/CategorySpendingComparison";
import { useRouter, useSearchParams } from "next/navigation";
import formatMonth from "@/helper/formatMonth";

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState();
  const [incomeSummary, setIncomeSummary] = useState();

  const searchParams = useSearchParams();
  const initialMonth = searchParams.get("month");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

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
  const fetchIncomeSummary = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setIncomeSummary(response.data);
    } catch (err) {}
  };
  const fetchExpenseCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setCategoryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchIncomeSummary();
    fetchExpenseCategory();
  }, [session, selectedMonth]);

  useEffect(() => {
    fetchAvailableMonth();
  }, [session]);
  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2">
        <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
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
        </div>
      </div>
      <div className="grid grid-cols-10 gap-6 py-4">
        <div className="col-span-10 md:col-span-3">
          <MonthlyOverview expenseData={categoryData} incomeData={incomeSummary} />
        </div>

        <div className="col-span-10 md:col-span-3 bg-white p-6 shadow-md rounded-lg">
          <TopThreeOverview expenseData={categoryData} incomeData={incomeSummary} />
        </div>

        <div className="h-full col-span-10 md:col-span-4">
          <CategorySpendingRadialChart categoryData={categoryData?.categoryExpenses} />
        </div>

        <div className="h-full col-span-10 md:col-span-5">
          <ExpenseByCategoryBarchart expenseCategoryData={categoryData?.categoryExpenses} />
        </div>

        <div className="col-span-10 md:col-span-5">
          <CategorySpendingComparison selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Categories from "./Categories";
import ExpenseByCategoryBarchart from "./ExpenseByCategoryBarchart";
import formatMonth from "@/helper/formatMonth";
import CategorySpendingRadialChart from "./CategorySpendingRadialChart";
import CategorySpendingComparison from "./CategorySpendingComparison";
function ExpenseCategory() {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const initialMonth = searchParams.get("month");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const [categoryData, setCategoryData] = useState();
  const [availableMonths, setAvailableMonths] = useState();
  const router = useRouter();

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
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setCategoryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchAvailableMonth();
  }, [session]);
  useEffect(() => {
    fetchCategory();
  }, [session, selectedMonth]);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };
  return (
    <div className="pr-4">
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-3xl font-semibold text-primary">Category Overview</h1>
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
            onClick={() => router.push("/category/addcategory")}
          >
            Add Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <Categories categoryData={categoryData} selectedMonth={selectedMonth} />
        </div>

        <div className="h-full col-span-1 lg:col-span-3 ">
          <ExpenseByCategoryBarchart expenseCategoryData={categoryData?.categoryExpenses} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="h-full col-span-1 md:col-span-2 lg:col-span-2 ">
          <CategorySpendingRadialChart categoryData={categoryData?.categoryExpenses} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 ">
          <CategorySpendingComparison selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseCategory;

"use client";
import React, { useState, useEffect } from "react";
import CategorySpendingRadialChart from "../category/(expense)/CategorySpendingRadialChart";
import { useSession } from "next-auth/react";
import axios from "axios";
import MonthlyOverview from "./MonthlyOverview";
import TopThreeOverview from "./TopThreeOverview";
import ExpenseByCategoryBarchart from "../category/(expense)/ExpenseByCategoryBarchart";
import CategorySpendingComparison from "../category/(expense)/CategorySpendingComparison";

function Dashboard() {
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState();
  const [incomeSummary, setIncomeSummary] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );

  const fetchIncomeSummary = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setIncomeSummary(response.data);
    } catch (err) {}
  };
  const fetchExpenseCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setCategoryData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchIncomeSummary();
    fetchExpenseCategory();
  }, [session, selectedMonth]);

  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2">
        <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
      </div>
      <div className="grid grid-cols-10 gap-6 py-4">
        <div className="col-span-3">
          <MonthlyOverview
            expenseData={categoryData}
            incomeData={incomeSummary}
          />
        </div>

        <div className="col-span-3 bg-white p-6 shadow-md rounded-lg">
          <TopThreeOverview
            expenseData={categoryData}
            incomeData={incomeSummary}
          />
        </div>

        <div className="h-full col-span-4">
          <CategorySpendingRadialChart
            categoryData={categoryData?.categoryExpenses}
          />
        </div>
        <div className="h-full col-span-5">
          <ExpenseByCategoryBarchart
            expenseCategoryData={categoryData?.categoryExpenses}
          />
        </div>
        <div className="col-span-5">
          <CategorySpendingComparison selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

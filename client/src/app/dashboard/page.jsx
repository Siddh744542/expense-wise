"use client";
import React, { useState, useEffect } from "react";
import CategorySpendingRadialChart from "../category/(expense)/CategorySpendingRadialChart";
import { useSession } from "next-auth/react";
import axios from "axios";
function Dashboard() {
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );

  const fetchCategory = async () => {
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
    fetchCategory();
  }, [session, selectedMonth]);

  return (
    <div className="pr-5">
      {/* header */}
      <div className="flex justify-between items-center py-2">
        <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
      </div>
      <div className="grid grid-cols-10 gap-4 p-4">
        <div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">Monthly Overview</h2>
        </div>

        <div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
        </div>

        <div className="h-full col-span-4 bg-white p-4 shadow-md rounded-lg">
          <CategorySpendingRadialChart
            categoryData={categoryData?.categoryExpenses}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

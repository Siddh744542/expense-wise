"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import formatMonth from "@/helper/formatMonth";
import { getAvailableMonths } from "@/react-query/query/monthFilterQuery";

function MonthFilter({ selectedMonth }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };
  const [availableMonths, isLoadingMonths] = getAvailableMonths(session?.user?.id);

  return (
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
          [...availableMonths].reverse().map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))
        ) : (
          <option disabled>No months available</option>
        )}
      </select>
    </div>
  );
}

export default MonthFilter;

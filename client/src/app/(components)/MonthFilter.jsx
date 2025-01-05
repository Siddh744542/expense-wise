"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import React from "react";
import formatMonth from "@/helper/formatMonth";

const fetchAvailableMonths = async (userId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/getavailablemonths`,
    {
      params: { userId }
    }
  );
  return response.data?.months;
};
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

  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", session?.user?.id],
    queryFn: () => fetchAvailableMonths(session?.user?.id),
    enabled: !!session?.user?.id
  });
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

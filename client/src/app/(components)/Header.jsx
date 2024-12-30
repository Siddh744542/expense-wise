import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
const fetchAvailableMonths = async (userId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/getavailablemonths`,
    {
      params: { userId }
    }
  );
  return response.data?.months;
};
function Header() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedMonth = searchParams.get("month");
  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", session?.user?.id],
    queryFn: () => fetchAvailableMonths(session?.user?.id),
    enabled: !!session?.user?.id
  });

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth);
    router.push(`?${params.toString()}`, { shallow: true });
  };
  return (
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
      </div>
    </div>
  );
}

export default Header;

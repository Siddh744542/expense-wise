import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getDashboardData(userId, selectedMonth) {
  const { data: dashbaordData, isLoading: isLoadingDashboardData } = useQuery({
    queryKey: ["dashboardData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });

  return [dashbaordData, isLoadingDashboardData];
}

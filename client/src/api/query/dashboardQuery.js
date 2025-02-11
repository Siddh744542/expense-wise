import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../constants";

export function getDashboardData(userId, selectedMonth) {
  const { data: dashbaordData, isLoading: isLoadingDashboardData } = useQuery({
    queryKey: ["dashboardData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/dashboard`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });

  return [dashbaordData, isLoadingDashboardData];
}

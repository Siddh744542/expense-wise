import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../../constants";
export function getIncomeSourceData(userId, selectedMonth) {
  const {
    data: incomeSourceData,
    isLoading: isLoadingSource,
    refetch
  } = useQuery({
    queryKey: ["sourceData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/incomesource`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [incomeSourceData, isLoadingSource, refetch];
}

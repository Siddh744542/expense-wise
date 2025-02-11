import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../../constants";

export function getExpenseCategoryData(userId, selectedMonth) {
  const {
    data: expenseCategoryData,
    isLoading: isLoadingCategory,
    refetch
  } = useQuery({
    queryKey: ["categoryData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/category`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [expenseCategoryData, isLoadingCategory, refetch];
}

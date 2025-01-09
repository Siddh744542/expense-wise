import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getExpenseCategoryData(userId, selectedMonth) {
  const {
    data: expenseCategoryData,
    isLoading: isLoadingCategory,
    refetch
  } = useQuery({
    queryKey: ["categoryData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/category`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [expenseCategoryData, isLoadingCategory, refetch];
}

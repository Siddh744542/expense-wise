import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../constants";

export function getExpenseSummary(userId, selectedMonth) {
  const { data: expenseSummaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["expenseSummaryData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/expense/summary`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });

  return [expenseSummaryData, isLoadingSummary];
}

export function getExpenseList(page, userId) {
  const { data: expenseList, isLoading: isLoadingList } = useQuery({
    queryKey: ["expenseList", { page }],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/expense/getexpense`, {
        params: { userId: userId, page: page }
      });
      const hasNext = page < response.data.totalPages;
      return {
        ...response.data,
        nextPage: hasNext ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined
      };
    },
    keepPreviousData: true,
    enabled: !!userId
  });

  return [expenseList, isLoadingList];
}

export function getCategories(userId, selectedMonth) {
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/expense/summary`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [categoryData, isCategoryLoading];
}

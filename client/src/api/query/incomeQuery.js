import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getIncomeSummary(userId, selectedMonth) {
  const { data: incomeSummaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["incomeSummaryData", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [incomeSummaryData, isLoadingSummary];
}

export function getIncomeList(page, userId) {
  const { data: incomeList, isLoading: isListLoading } = useQuery({
    queryKey: ["incomesList", { page }],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/getincome`, {
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
  return [incomeList, isListLoading];
}

export function getSourceData(userId, selectedMonth) {
  const { data: sourceData, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["Sources", userId, selectedMonth],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/getsources`, {
        params: { userId: userId, month: selectedMonth }
      });
      return response.data;
    },
    enabled: !!userId && !!selectedMonth
  });
  return [sourceData, isLoadingMonths];
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SERVER_URL } from "../../../constants";

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ expenseId, userId }) => {
      await axios.delete(`${SERVER_URL}/expense/deleteexpense`, {
        data: { userId, expenseId }
      });
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      queryClient.invalidateQueries(["expenseList"]);
      queryClient.invalidateQueries(["expenseSummaryData"]);
    },
    onError: () => {
      toast.error("Failed to delete expense.");
    }
  });
}

export function useRepeatExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (repeatData) => {
      await axios.post(`${SERVER_URL}/expense/addexpense`, repeatData);
    },
    onSuccess: () => {
      toast.success("Expense repeated successfully!");
      queryClient.invalidateQueries(["expenseList"]);
      queryClient.invalidateQueries(["expenseSummaryData"]);
    },
    onError: () => {
      toast.error("Failed to repeat expense.");
    }
  });
}

export function useAddExpenseMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData) => {
      await axios.post(`${SERVER_URL}/expense/addexpense`, formData);
    },
    onSuccess: () => {
      toast.success("Expense Add successfully!");
      queryClient.invalidateQueries(["expenseList"]);
      queryClient.invalidateQueries(["expenseSummaryData"]);
      router.push("/expense");
    },
    onError: () => {
      toast.error("Failed to add expense.");
    }
  });
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData) => {
      await axios.put(`${SERVER_URL}/expense/updateexpense`, formData);
    },
    onSuccess: () => {
      toast.success("Expense Updated successfully!");
      queryClient.invalidateQueries(["expenseList"]);
      queryClient.invalidateQueries(["expenseSummaryData"]);
      router.push("/expense");
    },
    onError: () => {
      toast.error("Failed to Update expense.");
    }
  });
}

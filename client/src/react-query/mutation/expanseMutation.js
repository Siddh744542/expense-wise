import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ expenseId, userId }) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/deleteexpense`, {
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
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, repeatData);
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
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, formData);
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
      await axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/updateexpense`, formData);
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

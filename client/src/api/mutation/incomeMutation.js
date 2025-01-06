import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useDeleteIncomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ incomeId, userId }) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/income/deleteincome`, {
        data: { userId: userId, incomeId: incomeId }
      });
    },
    onSuccess: () => {
      toast.success("Income deleted successfully!");
      queryClient.invalidateQueries(["incomesList"]);
      queryClient.invalidateQueries(["incomeSummaryData"]);
    },
    onError: () => {
      toast.error("Failed to delete income.");
    }
  });
}

export function useRepeatIncomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (repeatData) => {
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`, repeatData);
    },

    onSuccess: () => {
      toast.success("Income repeated successfully!");
      queryClient.invalidateQueries(["incomesList"]);
      queryClient.invalidateQueries(["incomeSummaryData"]);
    },
    onError: () => {
      toast.error("Failed to repeat income.");
    }
  });
}

export function useAddIncomeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      return axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`, data);
    },
    onSuccess: () => {
      toast.success("Income added successfully!");
      queryClient.invalidateQueries(["incomesList"]);
      queryClient.invalidateQueries(["incomeSummaryData"]);
      router.push("/income");
    },
    onError: () => {
      toast.error("Failed to add income.");
    }
  });
}
export function useUpdateIncomeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      return axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/income/updateincome`, data);
    },
    onSuccess: () => {
      toast.success("Income updated successfully!");
      queryClient.invalidateQueries(["incomesList"]);
      queryClient.invalidateQueries(["incomeSummaryData"]);
      router.push("/income");
    },
    onError: () => {
      toast.error("Failed to update income.");
    }
  });
}

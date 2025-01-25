import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SERVER_URL } from "../../../constants";

export function useDeleteIncomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ incomeId, userId }) => {
      await axios.delete(`${SERVER_URL}/income/deleteincome`, {
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
      await axios.post(`${SERVER_URL}/income/addincome`, repeatData);
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
      return axios.post(`${SERVER_URL}/income/addincome`, data);
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
      return axios.put(`${SERVER_URL}/income/updateincome`, data);
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

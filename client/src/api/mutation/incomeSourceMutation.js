import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useDeleteIncomeSourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/delete`, {
        data
      });
    },
    onSuccess: async () => {
      toast.success("Income Source deleted successfully!");
      //   await refetch();
      await queryClient.invalidateQueries(["sourceData"]);
    },
    onError: () => {
      toast.error("Failed to delete Income Source.");
    }
  });
}
export function useUpdateIncomeSourceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      await axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/update`, data);
    },
    onSuccess: () => {
      toast.success("Source updated successfully!");
      queryClient.invalidateQueries(["sourceData"]);
      router.push("/category?isexpense=false");
    },
    onError: () => {
      toast.error("Failed to update Source.");
    }
  });
}
export function useAddIncomeSourceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/add`, data);
    },
    onSuccess: () => {
      toast.success("Source added successfully!");
      queryClient.invalidateQueries(["sourceData"]);
      router.push("/category?isexpense=false");
    },
    onError: () => {
      toast.error("Failed to add Source.");
    }
  });
}

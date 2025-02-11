import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SERVER_URL } from "../../../constants";

export function useDeleteExpenseCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await axios.delete(`${SERVER_URL}/category/delete`, { data });
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categoryData"]);
    },
    onError: () => {
      toast.error("Failed to delete category.");
    }
  });
}
export function useUpdateExpenseCategoryMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      await axios.put(`${SERVER_URL}/category/updatecategory`, data);
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries(["categoryData"]);
      router.push("/category");
    },
    onError: () => {
      toast.error("Failed to update category.");
    }
  });
}
export function useAddExpenseCategoryMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      await axios.post(`${SERVER_URL}/category/addcategory`, data);
    },
    onSuccess: () => {
      toast.success("Category added successfully!");
      queryClient.invalidateQueries(["categoryData"]);
      router.push("/category");
    },
    onError: () => {
      toast.error("Failed to add Category.");
    }
  });
}

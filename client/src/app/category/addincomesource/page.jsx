"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddIncomeSourceForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    source: "",
    month: ""
  });

  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
    if (searchParams.size > 0 && searchParams.has("source")) {
      setFormData({
        source: searchParams.get("source") || "",
        month: searchParams.get("month") || ""
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const AddMutation = useMutation({
    mutationFn: async (data) => {
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/add`, data);
    },
    onSuccess: () => {
      toast.success("Source added successfully!");
      queryClient.invalidateQueries(["sourceData", session?.user?.id, selectedMonth]);
      router.push("/category?isexpense=false");
    },
    onError: () => {
      toast.error("Failed to add Source.");
    }
  });

  const UpdateMutation = useMutation({
    mutationFn: async (data) => {
      await axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/update`, data);
    },
    onSuccess: () => {
      toast.success("Source updated successfully!");
      queryClient.invalidateQueries(["sourceData", session?.user?.id, selectedMonth]);
      router.push("/category?isexpense=false");
    },
    onError: () => {
      toast.error("Failed to update Source.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      UpdateMutation.mutate({
        userId: session?.user.id,
        sourceId: searchParams.get("id"),
        ...formData
      });
    } else {
      AddMutation.mutate({
        userId: session?.user.id,
        ...formData
      });
    }
  };

  const handleAdd = async () => {
    try {
      await toast
        .promise(
          axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/add`, {
            userId: session?.user.id,
            ...formData
          }),
          {
            loading: "Adding income source...",
            success: "income source added successfully!",
            error: "Failed to add income source."
          }
        )
        .then(() => {
          setFormData({
            source: "",
            month: ""
          });
          router.push("/category?isexpense=false");
        });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await toast
        .promise(
          axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/update`, {
            userId: session?.user.id,
            sourceId: searchParams.get("id"),
            ...formData
          }),
          {
            loading: "Updating income source...",
            success: "Income Source updated successfully!",
            error: "Failed to update income source."
          }
        )
        .then(() => {
          router.push("/category?isexpense=false");
        });
    } catch (error) {
      console.error("Error updating income source:", error);
    }
  };

  return (
    <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold text-primary-700 text-center mb-4">
        {isEditing ? "Update Income Source" : "Add New Income Source"}
      </h2>

      <div className="p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="category" className="text-gray-600 mb-1">
              Source Name
            </label>
            <input
              type="text"
              name="source"
              id="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter source name"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="month" className="text-gray-600 mb-1">
              Month
            </label>
            <input
              type="month"
              name="month"
              id="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="Select month"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition"
          >
            {isEditing ? "Update Income Source" : "Add Income Source"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeSourceForm;

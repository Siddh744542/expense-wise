"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddIncomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const [sourceData, setSourceData] = useState();
  const initialMonth = searchParams.get("month");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    source: "",
    amount: "",
    description: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSources();
  }, [session, selectedMonth]);

  useEffect(() => {
    if (searchParams.size > 0 && searchParams.has("amount")) {
      setFormData({
        date: searchParams.get("date")?.split("T")[0] || today,
        source: searchParams.get("source") || "",
        amount: searchParams.get("amount") || "",
        description: searchParams.get("description") || ""
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  const fetchSources = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/getsources`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setSourceData(response.data);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    if (name === "date") {
      const updatedMonth = value.slice(0, 7);
      setSelectedMonth(updatedMonth);
      fetchSummary();
    }
  };

  // Add income mutation
  const addMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`, data);
    },
    onSuccess: () => {
      toast.success("Income added successfully!");
      queryClient.invalidateQueries(["incomes", { page: 1 }]);
      queryClient.invalidateQueries(["incomeSummaryData", session?.user?.id, selectedMonth]);
      router.push("/income");
    },
    onError: () => {
      toast.error("Failed to add income.");
    }
  });

  // Update income mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/income/updateincome`, data);
    },
    onSuccess: () => {
      toast.success("Income updated successfully!");
      queryClient.invalidateQueries(["incomes", { page: 1 }]);
      queryClient.invalidateQueries(["incomeSummaryData", session?.user?.id, selectedMonth]);
      router.push("/income");
    },
    onError: () => {
      toast.error("Failed to update income.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { userId: session?.user.id, ...formData };

    if (isEditing) {
      updateMutation.mutate({ ...data, incomeId: searchParams.get("id") });
    } else {
      addMutation.mutate(data);
    }
  };

  return (
    <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
      <h2 className="text-3xl font-semibold text-primary-700 text-center mb-4">
        {isEditing ? "Update Income" : "Add Income"}
      </h2>

      <div className="p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Input */}
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            />
          </div>

          {/* Source Input */}
          <div className="flex flex-col">
            <label htmlFor="source" className="text-gray-600 mb-1">
              Source
            </label>
            <div className="flex gap-2">
              <select
                name="source"
                id="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
                required
              >
                <option value="" disabled>
                  Select Source
                </option>
                {sourceData?.map((source) => (
                  <option key={source.source} value={source.source}>
                    {source.source}
                  </option>
                ))}
              </select>
              <Link href={"/category/addincomesource"}>
                <button className="w-max bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition">
                  Add Source
                </button>
              </Link>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col relative">
            <label htmlFor="amount" className="text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            />
          </div>

          {/* Description Input */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition"
          >
            {isEditing ? "Update Income" : "Add Income"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomePage;

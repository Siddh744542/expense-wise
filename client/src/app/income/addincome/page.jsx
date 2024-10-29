"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddIncome = ({ searchParams }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sourceData, setSourceData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );

  const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

  const [formData, setFormData] = useState({
    date: today,
    source: "",
    amount: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSummary();
    if (Object.keys(searchParams).length > 0) {
      setFormData({
        date: searchParams.date?.split("T")[0] || today,
        source: searchParams.source || "",
        amount: searchParams.amount || "",
        description: searchParams.description || "",
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams, session]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/income/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setSourceData(response.data);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "date") {
      const updatedMonth = value.slice(0, 7);
      setSelectedMonth(updatedMonth);
      fetchSummary();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdatation();
    } else {
      handleAdd();
    }
  };
  const handleAdd = async () => {
    try {
      await toast
        .promise(
          axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`, {
            userId: session?.user.id,
            ...formData,
          }),
          {
            loading: "Adding income...",
            success: "Income Added successfully!",
            error: "Failed to Add income.",
          }
        )
        .then(() => {
          setFormData({
            date: today,
            source: "",
            amount: "",
            description: "",
          });
          router.push("/income");
        });
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };
  const handleUpdatation = async () => {
    try {
      await toast
        .promise(
          axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/income/updateincome`, {
            userId: session?.user.id,
            incomeId: searchParams.id,
            ...formData,
          }),
          {
            loading: "Updating income...",
            success: "Income updated successfully!",
            error: "Failed to update income.",
          }
        )
        .then(() => {
          router.push("/income");
        });
    } catch (err) {
      console.error("Error updating income:", err);
    }
  };
  return (
    <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
      {/* Title Outside of the Box */}
      <h2 className="text-3xl font-semibold text-primary-700 text-center mb-4">
        {isEditing ? "Update Income" : "Add Income"}
      </h2>

      {/* White Boxed Form */}
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
            <select
              name="source"
              id="source"
              value={formData.source}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            >
              <option value="" disabled>
                Select Source
              </option>
              {sourceData?.sources.map((source) => (
                <option key={source.source} value={source.source}>
                  {source.source}
                </option>
              ))}
            </select>
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

export default AddIncome;

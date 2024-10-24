"use client";
import React, { useState, useEffect } from "react";
import getLimitGradient from "@/helper/getGradient";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const DailyExpenseForm = ({ searchParams }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().toISOString().slice(0, 7))
  );
  const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    date: today,
    category: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchCategory();
    if (Object.keys(searchParams).length > 0) {
      setFormData({
        date: searchParams.date?.split("T")[0] || today,
        category: searchParams.category || "",
        amount: searchParams.amount || "",
        description: searchParams.description || "",
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams, session]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`,
        {
          params: { userId: session?.user.id, month: selectedMonth },
        }
      );
      setCategoryData(response.data);
    } catch (err) {}
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "date") {
      const updatedMonth = value.slice(0, 7);
      setSelectedMonth(updatedMonth);
      fetchCategory();
    }
  };

  const handleSubmit = async (e) => {
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
          axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, {
            userId: session?.user.id,
            ...formData,
          }),
          {
            loading: "Adding expense...",
            success: "Expense Added successfully!",
            error: "Failed to Add expense.",
          }
        )
        .then(() => {
          setFormData({
            date: today,
            category: "",
            amount: "",
            description: "",
          });
          router.push("/expense");
        });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleUpdatation = async () => {
    try {
      await toast
        .promise(
          axios.put(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/updateexpense`, {
            userId: session?.user.id,
            expenseId: searchParams.id,
            ...formData,
          }),
          {
            loading: "Updating expense...",
            success: "Expense updated successfully!",
            error: "Failed to update expense.",
          }
        )
        .then(() => {
          router.push("/expense");
        });
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  return (
    <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
      {/* Title*/}
      <h2 className="text-2xl font-semibold text-primary-700 text-center mb-4">
        {isEditing ? "Update Daily Expense" : "Add Daily Expense"}
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

          {/* Category Input */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-gray-600 mb-1">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categoryData?.categoryExpenses.map((categories) => (
                <option key={categories.category} value={categories.category}>
                  {categories.category}
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
            {isEditing ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyExpenseForm;

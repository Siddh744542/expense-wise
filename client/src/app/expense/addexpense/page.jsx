"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { X, CircleAlert } from "lucide-react";
import Link from "next/link";

const ConfirmLimitModal = ({ isOpen, onClose, handleConfirm, percentage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="relative bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-lg z-10 max-w-sm">
        <button
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center mb-4">
          <CircleAlert className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-700">Warning: Limit Reached</h3>
        </div>

        <p className="text-yellow-800 mb-4">
          You have reached <strong>{percentage}%</strong> of your limit. Do you want to add more?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => handleConfirm(false)}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleConfirm(true)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const DailyExpenseForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [categoryData, setCategoryData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [limitReachedPercentage, setLimitReachedPercentage] = useState();
  const today = new Date().toISOString().split("T")[0];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    date: today,
    category: "",
    amount: "",
    description: ""
  });

  useEffect(() => {
    fetchCategory();
  }, [session]);

  useEffect(() => {
    if (searchParams.size > 0 && searchParams.has("amount")) {
      setFormData({
        date: searchParams.get("date")?.split("T")[0] || today,
        category: searchParams.get("category") || "",
        amount: searchParams.get("amount") || "",
        description: searchParams.get("description") || ""
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const categoryDetails = categoryData?.categoryExpenses.find(
      (cat) => cat.category === formData.category
    );
    if (categoryDetails) {
      const percentage = ((categoryDetails.amount / categoryDetails.limit) * 100).toFixed(2);
      setLimitReachedPercentage(percentage);
    }
  }, [formData.category, categoryData]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/summary`, {
        params: { userId: session?.user.id, month: selectedMonth }
      });
      setCategoryData(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === "date") {
      const updatedMonth = value.slice(0, 7);
      setSelectedMonth(updatedMonth);
      fetchCategory();
    }
  };

  const handleConfirm = (confirm) => {
    setIsModalOpen(false);
    if (confirm) handleSubmit();
  };

  const handleSubmit = async () => {
    if (isEditing) {
      handleUpdatation();
    } else {
      handleAdd();
    }
  };

  const handleLimitReachedPopUp = (e) => {
    e.preventDefault();
    limitReachedPercentage > 90 ? setIsModalOpen(true) : handleSubmit();
  };

  const handleAdd = async () => {
    try {
      await toast
        .promise(
          axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, {
            userId: session?.user.id,
            ...formData
          }),
          {
            loading: "Adding expense...",
            success: "Expense Added successfully!",
            error: "Failed to Add expense."
          }
        )
        .then(() => {
          setFormData({
            date: today,
            category: "",
            amount: "",
            description: ""
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
            expenseId: searchParams.get("id"),
            ...formData
          }),
          {
            loading: "Updating expense...",
            success: "Expense updated successfully!",
            error: "Failed to update expense."
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
    <div>
      <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700 text-center mb-4">
          {isEditing ? "Update Daily Expense" : "Add Daily Expense"}
        </h2>

        <div className="p-6 bg-white shadow-md rounded-md">
          <form onSubmit={handleLimitReachedPopUp} className="space-y-4">
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

            <div className="flex flex-col">
              <label htmlFor="category" className="text-gray-600 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
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
                <Link href={"/category/addcategory"}>
                  <button className="w-max bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition">
                    Add Category
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="amount" className=" font-sans text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 `}
                required
              />
            </div>

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

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition"
            >
              {isEditing ? "Update Expense" : "Add Expense"}
            </button>
          </form>
        </div>
      </div>
      <ConfirmLimitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirm}
        percentage={limitReachedPercentage}
      />
    </div>
  );
};

export default DailyExpenseForm;

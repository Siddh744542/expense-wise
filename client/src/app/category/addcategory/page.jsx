"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  useAddExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation
} from "@/react-query/mutation/expenseCategoryMutation";

const AddCategoryForm = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: new Date().toISOString().slice(0, 7)
  });

  useEffect(() => {
    if (searchParams.size > 0 && searchParams.has("category")) {
      setFormData({
        category: searchParams.get("category") || "",
        limit: searchParams.get("limit") || "",
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

  const AddMutation = useAddExpenseCategoryMutation();

  const UpdateMutation = useUpdateExpenseCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      UpdateMutation.mutate({
        userId: session?.user.id,
        categoryId: searchParams.get("id"),
        ...formData
      });
    } else {
      AddMutation.mutate({ ...formData, userId: session?.user.id });
    }
  };

  return (
    <div className="!w-1/2 px- mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold text-primary-700 text-center mb-4">
        {isEditing ? "Update Category" : "Add New Category"}
      </h2>

      <div className="p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="category" className="text-gray-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category name"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-primary-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="limit" className="text-gray-600 mb-1">
              Limit (₹)
            </label>
            <input
              type="number"
              name="limit"
              id="limit"
              value={formData.limit}
              onChange={handleChange}
              placeholder="Enter limit for the category"
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
            {isEditing ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;

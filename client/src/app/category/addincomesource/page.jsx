"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddIncomeSourceForm = ({ searchParams }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    month: "",
  });

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      setFormData({
        source: searchParams.source || "",
        month: searchParams.month || "",
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
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    try {
      await toast
        .promise(
          axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/add`, {
            userId: session?.user.id,
            ...formData,
          }),
          {
            loading: "Adding income source...",
            success: "income source added successfully!",
            error: "Failed to add income source.",
          }
        )
        .then(() => {
          setFormData({
            source: "",
            month: "",
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
            sourceId: searchParams.id,
            ...formData,
          }),
          {
            loading: "Updating income source...",
            success: "Income Source updated successfully!",
            error: "Failed to update income source.",
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

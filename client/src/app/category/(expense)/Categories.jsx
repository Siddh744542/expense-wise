import React, { useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// Modal Component for confirmation
const ConfirmDeleteModal = ({ isOpen, onClose, handleDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
        <button
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
        <p className="mb-4">
          Do you want to delete all expenses for this category as well?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => handleDelete(false)}
          >
            No, Keep Expenses
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleDelete(true)}
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

function Categories({ categoryData, selectedMonth }) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  const openModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (deleteExpenses) => {
    try {
      await toast.promise(
        axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/category/delete`, {
          data: {
            userId: session?.user.id,
            categoryId: selectedCategory,
            deleteExpenses: deleteExpenses,
          },
        }),
        {
          loading: "Deleting category...",
          success: "Category deleted successfully!",
          error: "Failed to delete category.",
        }
      );
      closeModal();
      router.reload();
    } catch (error) {
      console.error("Error deleting category:", error);
      closeModal();
    }
  };

  return (
    <div className="h-[370px] bg-white p-5 pr-1 rounded-lg shadow flex flex-col">
      {/* Total Expenses */}
      <div className="space-y-2 pr-5">
        <div className="text-primary-600 font-semibold text-xl flex justify-between">
          Total Expenses:
          <div className="text-action font-bold text-2xl">
            ₹{categoryData?.totalExpenses || 0}
          </div>
        </div>
      </div>

      {/* Category Expenses List */}
      <div className="mt-2 flex-1 overflow-y-auto space-y-2 py-0.5">
        {categoryData?.categoryExpenses.length > 0 ? (
          categoryData?.categoryExpenses.map((categoryExpense) => (
            <div
              key={categoryExpense?._id}
              className="flex justify-between items-center border-b pb-2 mb-2"
            >
              <div>
                <p className="text-gray-700 font-medium">
                  {categoryExpense?.category}
                </p>
                <p className="text-gray-500">
                  Spent: ₹{categoryExpense?.amount}
                </p>
              </div>

              <div className="flex items-center space-x-2 pr-2">
                <div className="bg-gray-100 text-gray-600 rounded-full px-4 py-1">
                  Limit: ₹{categoryExpense?.limit}
                </div>

                {/* Edit Button */}
                <Link
                  href={{
                    pathname: "/category/addcategory",
                    query: {
                      id: categoryExpense._id,
                      category: categoryExpense.category,
                      limit: categoryExpense.limit,
                      month: selectedMonth,
                    },
                  }}
                >
                  <button className="p-1 rounded hover:bg-primary-300 hover:text-white transition-colors">
                    <Pen className="w-4 h-4" />
                  </button>
                </Link>

                {/* Delete Button */}
                <button
                  className="p-1 rounded hover:bg-red-400 hover:text-white transition-colors"
                  onClick={() => openModal(categoryExpense?._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No category expenses available</p>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        handleDelete={handleDeleteCategory}
      />
    </div>
  );
}

export default Categories;

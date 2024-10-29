import { Pen, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

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

        <h3 className="text-lg font-semibold mb-4">Delete Source</h3>
        <p className="mb-4">
          Do you want to delete all income for this Source as well?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => handleDelete(false)}
          >
            No, Keep Incomes
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

function SourceSummary({ summaryData, selectedMonth }) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const router = useRouter();

  const openModal = (categoryId) => {
    setSelectedSource(categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSource(null);
  };

  const handleDeleteCategory = async (deleteIncomes) => {
    try {
      await toast.promise(
        axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/incomesource/delete`, {
          data: {
            userId: session?.user.id,
            sourceId: selectedSource,
            deleteIncomes: deleteIncomes,
            month: selectedMonth,
          },
        }),
        {
          loading: "Deleting source of Income...",
          success: "Source of Income deleted successfully!",
          error: "Failed to delete source of Income.",
        }
      );
      closeModal();
      router.reload();
    } catch (error) {
      console.error("Error deleting source of Income:", error);
      closeModal();
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <div className="space-y-2">
        <div className="space-y-2 pb-1">
          <div className="text-primary-500 font-semibold text-xl flex justify-between">
            Total Income:
            <div className="text-action font-bold text-2xl">
              ₹{summaryData?.totalIncome || 0}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {summaryData?.sources.length > 0 ? (
            summaryData?.sources.map((source) => (
              <div
                key={source?._id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                <p className="text-gray-600 font-semibold">{source?.source}:</p>

                <div className="flex space-x-2">
                  <p className="text-black-500 pr-1">₹{source?.total}</p>
                  <Link
                    href={{
                      pathname: "/category/addincomesource",
                      query: {
                        id: source._id,
                        source: source.source,
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
                    onClick={() => openModal(source?._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No Income source available</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        handleDelete={handleDeleteCategory}
      />
      {/* {error && <p className="text-red-500">{error}</p>} */}
    </div>
  );
}

export default SourceSummary;

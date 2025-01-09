"use client";
import { Pen, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useDeleteIncomeSourceMutation } from "@/api/mutation/incomeSourceMutation";

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
        <p className="mb-4">Do you want to delete all income for this Source as well?</p>

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

function SourceSummary({ summaryData, refetch }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const deleteSource = useDeleteIncomeSourceMutation();
  useEffect(() => {
    setSelectedMonth(searchParams.get("month"));
  }, [searchParams]);

  const openModal = (categoryId) => {
    setSelectedSource(categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSource(null);
  };

  const handleDeleteSource = async (deleteIncomes) => {
    const data = {
      userId: session?.user.id,
      sourceId: selectedSource,
      deleteIncomes: deleteIncomes,
      month: selectedMonth
    };
    deleteSource.mutate(data);
    await refetch();
    closeModal();
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-primary-600 font-semibold text-xl">
          <p>Total Income:</p>
          <div className="text-action font-bold text-xl">₹{summaryData?.totalIncome || 0}</div>
        </div>

        <div className="flex flex-col">
          {summaryData?.sources.length > 0 ? (
            summaryData?.sources.map((source, index) => (
              <div key={source?._id}>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 font-semibold text-sm ">{source?.source}:</p>

                  <div className="flex items-center gap-1.5">
                    <p className="text-gray-500 text-sm">₹{source?.total}</p>
                    <Link
                      href={{
                        pathname: "/category/addincomesource",
                        query: {
                          id: source._id,
                          source: source.source,
                          month: selectedMonth
                        }
                      }}
                    >
                      <button className="p-1 rounded hover:bg-action-300 hover:text-white transition-colors">
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
                {index < summaryData.sources.length - 1 && (
                  <hr className="border-gray-300 my-1.5" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No Income source available</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        handleDelete={handleDeleteSource}
      />
    </div>
  );
}

export default SourceSummary;

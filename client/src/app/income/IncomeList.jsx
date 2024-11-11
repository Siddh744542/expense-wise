"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Pen, Trash2, Repeat, LogIn } from "lucide-react";
import axios from "axios";
import Link from "next/link";

function IncomeList({ fetchSummary }) {
  const { data: session, status } = useSession();
  const [incomeData, setIncomeData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    fetchIncome();
  }, [session]);

  const fetchIncome = async (page = 1) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/income/getincome`,
        {
          params: {
            userId: session?.user.id,
            page: page,
          },
        }
      );

      setIncomeData(response.data.incomes);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching Income:", err);
    }
  };

  const handleDelete = async (incomeId) => {
    toast
      .promise(
        axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/income/deleteincome`, {
          data: { userId: session?.user.id, incomeId: incomeId },
        }),
        {
          loading: "Deleting income...",
          success: "Income deleted successfully!",
          error: "Failed to delete income.",
        }
      )
      .then(() => {
        fetchIncome();
        fetchSummary();
      })
      .catch((err) => {
        console.error("Error deleting income:", err);
      });
  };

  const handleRepeat = async (income) => {
    const today = new Date().toISOString().split("T")[0];
    const repeatData = {
      userId: session?.user.id,
      date: today,
      source: income.source,
      amount: income.amount,
      description: income.description,
    };

    try {
      toast
        .promise(
          axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`,
            repeatData
          ),
          {
            loading: "Repeating income...",
            success: "Income repeated successfully!",
            error: "Failed to repeat income.",
          }
        )
        .then(() => {
          fetchIncome();
          fetchSummary();
        });
    } catch (err) {
      console.error("Error repeating expense:", err);
    }
  };

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow h-[690px] flex flex-col">
      <h2 className="text-lg font-semibold text-primary mb-4">Income List</h2>

      {/* Scrollable List */}
      <ul className="space-y-3 flex-grow overflow-y-auto">
        {incomeData?.map((income) => (
          <li
            key={income?._id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex flex-col gap-1">
              <span className="text-gray-800 font-medium">
                {income?.source}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {new Date(income?.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                |
                <span className="italic text-gray-600">
                  {income?.description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-900">
                ₹{income?.amount}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  href={{
                    pathname: "/income/addincome",
                    query: {
                      id: income._id,
                      date: income.date,
                      source: income.source,
                      amount: income.amount,
                      description: income.description,
                    },
                  }}
                >
                  <button className="p-1 rounded hover:bg-primary-300 hover:text-white transition-colors">
                    <Pen className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  className="p-1 rounded hover:bg-red-400 hover:text-white transition-colors"
                  onClick={() => handleDelete(income?._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-action-300 hover:text-white transition-colors"
                  onClick={() => handleRepeat(income)}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 pt-4 border-t  bottom-0 bg-white">
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => fetchExpenses(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => fetchExpenses(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default IncomeList;

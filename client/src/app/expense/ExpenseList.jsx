"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Pen, Trash2, Repeat } from "lucide-react";
import axios from "axios";
import Link from "next/link";

function ExpenseList({ fetchSummary }) {
  const { data: session, status } = useSession();
  const [expenseData, setExpenseData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    fetchExpenses();
  }, [session]);

  const fetchExpenses = async (page = 1) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/getexpense`, {
        params: {
          userId: session?.user.id,
          page: page
        }
      });
      setExpenseData(response.data.expenses);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleDelete = async (expenseId) => {
    toast
      .promise(
        axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/deleteexpense`, {
          data: { userId: session?.user.id, expenseId: expenseId }
        }),
        {
          loading: "Deleting expense...",
          success: "Expense deleted successfully!",
          error: "Failed to delete expense."
        }
      )
      .then(() => {
        fetchExpenses();
        fetchSummary();
      })
      .catch((err) => {
        console.error("Error deleting expense:", err);
      });
  };

  const handleRepeat = async (expense) => {
    const today = new Date().toISOString().split("T")[0];
    const repeatData = {
      userId: session?.user.id,
      date: today,
      category: expense.category,
      amount: expense.amount,
      description: expense.description
    };

    try {
      toast
        .promise(axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, repeatData), {
          loading: "Repeating expense...",
          success: "Expense repeated successfully!",
          error: "Failed to repeat expense."
        })
        .then(() => {
          fetchExpenses();
          fetchSummary();
        });
    } catch (err) {
      console.error("Error repeating expense:", err);
    }
  };

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <h2 className="text-lg font-semibold text-primary mb-4">Expense List</h2>

      <ul className="space-y-3 flex-grow overflow-y-auto">
        {expenseData?.map((expense) => (
          <li key={expense?._id} className="flex justify-between items-center border-b pb-2">
            <div className="flex flex-col gap-1">
              <span className="text-gray-800 font-medium">{expense?.category}</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {new Date(expense?.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
                |<span className="italic text-gray-600">{expense?.description}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-900">₹{expense?.amount}</span>
              <div className="flex items-center gap-1">
                <Link
                  href={{
                    pathname: "/expense/addexpense",
                    query: {
                      id: expense._id,
                      date: expense.date,
                      category: expense.category,
                      amount: expense.amount,
                      description: expense.description
                    }
                  }}
                >
                  <button className="p-1 rounded hover:bg-primary-300 hover:text-white transition-colors">
                    <Pen className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  className="p-1 rounded hover:bg-red-400 hover:text-white transition-colors"
                  onClick={() => handleDelete(expense?._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-action-300 hover:text-white transition-colors"
                  onClick={() => handleRepeat(expense)}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 pt-4 border-t bottom-0 bg-white">
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

export default ExpenseList;

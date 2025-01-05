"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Pen, Trash2, Repeat } from "lucide-react";
import Link from "next/link";
import { getExpenseList } from "@/api/query/expenseQuery";
import { useDeleteExpenseMutation, useRepeatExpenseMutation } from "@/api/mutation/expanseMutation";

function ExpenseList() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const deleteExpenseMutation = useDeleteExpenseMutation();
  const repeatExpenseMutation = useRepeatExpenseMutation();

  const [expenseList, isLoadingList] = getExpenseList(page, session?.user?.id);

  const handleRepeat = (expense) => {
    const today = new Date().toISOString().split("T")[0];
    const repeatData = {
      userId: session?.user.id,
      date: today,
      category: expense.category,
      amount: expense.amount,
      description: expense.description
    };
    repeatExpenseMutation.mutate(repeatData);
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-5 rounded-lg shadow h-full">
      <h2 className="text-xl font-semibold text-primary">Expense List</h2>

      <ul className="flex flex-col flex-grow overflow-y-auto">
        {expenseList?.expenses.length > 0 ? (
          expenseList?.expenses.map((expense, index) => (
            <div key={expense?._id}>
              <li className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-800 text-sm font-medium">{expense?.category}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
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

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₹{expense?.amount}</span>
                  <div className="flex items-center gap-0.5">
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
                      onClick={() =>
                        deleteExpenseMutation.mutate({
                          expenseId: expense._id,
                          userId: session?.user?.id
                        })
                      }
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
              {index < expenseList?.expenses.length - 1 && (
                <hr className="border-gray-300 my-1.5" />
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-600 text-sm">no data, please add</div>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-1 pt-4 border-t bottom-0 bg-white">
        <button
          className="text-sm bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(expenseList.previousPage)}
          disabled={expenseList?.currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600 text-sm">
          Page {expenseList?.currentPage} of {expenseList?.totalPages}
        </span>
        <button
          className="text-sm bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(expenseList.nextPage)}
          disabled={expenseList?.currentPage === expenseList?.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ExpenseList;

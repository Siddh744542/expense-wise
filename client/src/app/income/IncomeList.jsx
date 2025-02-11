"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Pen, Trash2, Repeat, LogIn } from "lucide-react";
import Link from "next/link";
import { getIncomeList } from "@/react-query/query/incomeQuery";
import {
  useDeleteIncomeMutation,
  useRepeatIncomeMutation
} from "@/react-query/mutation/incomeMutation";

function IncomeList() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  // Fetch expenses with React Query
  const [incomeList, isListLoading] = getIncomeList(page, session?.user?.id);
  const deleteIncomeMutation = useDeleteIncomeMutation();

  const repeatIncomeMutation = useRepeatIncomeMutation();

  function handleRepeat(income) {
    const today = new Date().toISOString().split("T")[0];
    const repeatData = {
      userId: session?.user.id,
      date: today,
      source: income.source,
      amount: income.amount,
      description: income.description
    };
    repeatIncomeMutation.mutate(repeatData);
  }

  return (
    <div className="flex flex-col gap-3 bg-white p-5 rounded-lg shadow h-full">
      <h2 className="text-xl font-semibold text-primary">Income List</h2>

      {/* Scrollable List */}
      <ul className="flex flex-col flex-grow overflow-y-auto">
        {incomeList?.incomes?.length > 0 ? (
          incomeList?.incomes.map((income, index) => (
            <div key={income?._id}>
              <li className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-800 font-medium text-sm">{income?.source}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {new Date(income?.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    |<span className="italic text-gray-600">{income?.description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₹{income?.amount}</span>
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={{
                        pathname: "/income/addincome",
                        query: {
                          id: income._id,
                          date: income.date,
                          source: income.source,
                          amount: income.amount,
                          description: income.description
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
                        deleteIncomeMutation.mutate({
                          incomeId: income?._id,
                          userId: session?.user?.id
                        })
                      }
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
              {index < incomeList?.incomes.length - 1 && (
                <hr className="border-gray-300 my-1.5  " />
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">No income found</div>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-1 pt-4 border-t bottom-0 bg-white">
        <button
          className="text-sm bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(incomeList.previousPage)}
          disabled={incomeList?.currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600 text-sm">
          Page {incomeList?.currentPage} of {incomeList?.totalPages}
        </span>
        <button
          className="text-sm bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(incomeList.nextPage)}
          disabled={incomeList?.currentPage === incomeList?.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default IncomeList;

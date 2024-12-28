"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Pen, Trash2, Repeat } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

async function getExpensePaginated(page, userId) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/getexpense`, {
      params: {
        userId: userId,
        page: page
      }
    })
    .then((res) => {
      const hasNext = page < res.data.totalPages;
      return {
        ...res.data,
        nextPage: hasNext ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined
      };
    });
}
function ExpenseList() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(null);
  useEffect(() => {
    const initialMonth = searchParams.get("month");
    setSelectedMonth(initialMonth);
  }, [searchParams]);
  // Fetch expenses with React Query
  const { status, error, data } = useQuery({
    queryKey: ["expenses", { page }],
    queryFn: () => getExpensePaginated(page, session?.user.id),
    keepPreviousData: true,
    enabled: !!session?.user.id
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/deleteexpense`, {
        data: { userId: session?.user.id, expenseId }
      });
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      queryClient.invalidateQueries(["expenses", { page }]);
      queryClient.invalidateQueries(["expenseSummaryData", session?.user?.id, selectedMonth]);
    },
    onError: () => {
      toast.error("Failed to delete expense.");
    }
  });

  // Repeat expense mutation
  const repeatExpenseMutation = useMutation({
    mutationFn: async (expense) => {
      const today = new Date().toISOString().split("T")[0];
      const repeatData = {
        userId: session?.user.id,
        date: today,
        category: expense.category,
        amount: expense.amount,
        description: expense.description
      };
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/expense/addexpense`, repeatData);
    },

    onSuccess: () => {
      toast.success("Expense repeated successfully!");
      queryClient.invalidateQueries(["expenses", { page }]);
      queryClient.invalidateQueries(["expenseSummaryData", session?.user?.id, selectedMonth]);
    },
    onError: () => {
      toast.error("Failed to repeat expense.");
    }
  });

  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <h2 className="text-lg font-semibold text-primary mb-4">Expense List</h2>

      <ul className="space-y-3 flex-grow overflow-y-auto">
        {data?.expenses.map((expense) => (
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
                  onClick={() => deleteExpenseMutation.mutate(expense._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-action-300 hover:text-white transition-colors"
                  onClick={() => repeatExpenseMutation.mutate(expense)}
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
          onClick={() => setPage(data.previousPage)}
          disabled={data?.currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {data?.currentPage} of {data?.totalPages}
        </span>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(data.nextPage)}
          disabled={data?.currentPage === data?.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ExpenseList;

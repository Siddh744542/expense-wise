"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Pen, Trash2, Repeat, LogIn } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchIncomePaginated = async (page, userId) => {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_DOMAIN}/income/getincome`, {
      params: {
        userId,
        page
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
};

function IncomeList() {
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
    queryKey: ["incomes", { page }],
    queryFn: () => fetchIncomePaginated(page, session?.user.id),
    keepPreviousData: true,
    enabled: !!session?.user.id
  });

  // Delete income mutation
  const deleteIncomeMutation = useMutation({
    mutationFn: async (incomeId) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/income/deleteincome`, {
        data: { userId: session?.user.id, incomeId: incomeId }
      });
    },
    onSuccess: () => {
      toast.success("Income deleted successfully!");
      queryClient.invalidateQueries(["incomes", { page }]);
      queryClient.invalidateQueries(["incomeSummaryData", session?.user?.id, selectedMonth]);
    },
    onError: () => {
      toast.error("Failed to delete income.");
    }
  });
  const repeatIncomeMutation = useMutation({
    mutationFn: async (income) => {
      const today = new Date().toISOString().split("T")[0];
      const repeatData = {
        userId: session?.user.id,
        date: today,
        source: income.source,
        amount: income.amount,
        description: income.description
      };
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/income/addincome`, repeatData);
    },

    onSuccess: () => {
      toast.success("Income repeated successfully!");
      queryClient.invalidateQueries(["incomes", { page }]);
      queryClient.invalidateQueries(["incomeSummaryData", session?.user?.id, selectedMonth]);
    },
    onError: () => {
      toast.error("Failed to repeat income.");
    }
  });

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow h-[690px] flex flex-col">
      <h2 className="text-lg font-semibold text-primary mb-4">Income List</h2>

      {/* Scrollable List */}
      <ul className="space-y-3 flex-grow overflow-y-auto">
        {data?.incomes.map((income) => (
          <li key={income?._id} className="flex justify-between items-center border-b pb-2">
            <div className="flex flex-col gap-1">
              <span className="text-gray-800 font-medium">{income?.source}</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
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

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-900">₹{income?.amount}</span>
              <div className="flex items-center gap-1">
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
                  onClick={() => deleteIncomeMutation.mutate(income?._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-action-300 hover:text-white transition-colors"
                  onClick={() => repeatIncomeMutation.mutate(income)}
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

export default IncomeList;

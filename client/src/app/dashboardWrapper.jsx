"use client";
import { useState, Suspense, useEffect } from "react";
import Sidebar from "./(components)/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Loader = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
  </div>
);

const DashboardWrapper = ({ children }) => {
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 2 } }
  });

  useEffect(() => {
    if (status === "unauthenticated" || (!session && status !== "loading")) {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const month = searchParams.get("month");

    if (!month) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", currentMonth);
      router.replace(`?${params.toString()}`, { shallow: true });
    }
  }, [searchParams, router]);

  const toggleSidebar = () => {
    setIsSideBarCollapsed((prev) => !prev);
  };

  if (status === "loading") {
    return <Loader />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-full min-h-screen">
        {status === "authenticated" && (
          <Sidebar isCollapsed={isSideBarCollapsed} toggleSidebar={toggleSidebar} />
        )}
        <main
          className={`flex flex-col w-full h-full ${
            status === "authenticated" ? "py-4" : ""
          } ${isSideBarCollapsed ? "ml-20 md:ml-20" : "ml-64 md:ml-64"}`}
        >
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardWrapper;

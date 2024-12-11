"use client";
import { useState, Suspense, useEffect } from "react";
import Sidebar from "./(components)/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const Loader = () => <>Loading...</>;
const DashboardWrappper = ({ children }) => {
  const [isSideBarCollapsed, setIsSideBarColapsed] = useState(false);
  const { data: session, status } = useSession();
  const isVerified = status === "authenticated" ? true : false;
  console.log(session);
  const router = useRouter();
  useEffect(() => {
    if ((status === "unauthenticated" || !session) && status !== "loading") {
      router.push("/login");
    }
  }, [status]);
  const toggleSidebar = () => {
    setIsSideBarColapsed(!isSideBarCollapsed);
  };
  return (
    <Suspense fallback={<Loader />}>
      <div className={`flex w-full min-h-screen`}>
        {isVerified && <Sidebar isCollapsed={isSideBarCollapsed} toggleSidebar={toggleSidebar} />}
        <main
          className={`flex flex-col w-full h-full ${isVerified && "py-4"} ${
            isSideBarCollapsed ? "pl-24 md:pl-24" : "pl-72 md:pl-72"
          }`}
        >
          {children}
        </main>
      </div>
    </Suspense>
  );
};
export default DashboardWrappper;

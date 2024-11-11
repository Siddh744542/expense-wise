"use client";
import { useState } from "react";
import Sidebar from "./(components)/Sidebar";

import { useSession } from "next-auth/react";
const DashboardWrappper = ({ children }) => {
  const [isSideBarCollapsed, setIsSideBarColapsed] = useState(false);
  const { data: session, status } = useSession();
  const isVerified = status === "authenticated" ? true : false;
  console.log(session);

  const toggleSidebar = () => {
    setIsSideBarColapsed(!isSideBarCollapsed);
  };
  return (
    <div className={`flex w-full min-h-screen`}>
      {isVerified && (
        <Sidebar
          isCollapsed={isSideBarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}
      <main
        className={`flex flex-col w-full h-full ${isVerified && "py-7"} ${
          isSideBarCollapsed ? "pl-24 md:pl-24" : "pl-72 md:pl-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardWrappper;

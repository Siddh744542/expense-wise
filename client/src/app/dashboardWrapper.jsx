"use client";
import Sidebar from "./(components)/Sidebar";

import { useSession } from "next-auth/react";
const DashboardWrappper = ({ children }) => {
  const { data: session, status } = useSession();
  const isVerified = status === "authenticated" ? true : false;

  return (
    <div className={`flex w-full min-h-screen`}>
      {isVerified && <Sidebar />}
      <main
        className={`flex flex-col w-full h-full ${
          isVerified && "py-7  md:pl-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardWrappper;

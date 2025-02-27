"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  LayoutList,
  Sprout,
  Wallet,
  CircleUserRound,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Logout } from "./logout";

function SidebarLink({ label, Icon, href, isCollapsed }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hrefWithParams = {
    pathname: href,
    query: {
      month: searchParams.get("month")
    }
  };
  const isActive = pathname == href || (pathname === "/" && href === "/dashboard");
  return (
    <Link href={hrefWithParams} className="flex">
      <div className={`${isActive ? "bg-primary" : "bg-white"} w-1`}></div>
      <div
        className={`flex items-center p-3 px-5 w-full transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-highlight to-white text-primary"
            : "bg-white text-gray-700 hover:bg-background"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        {Icon && <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-black"}`} />}
        {!isCollapsed && (
          <span className={`font-medium ml-3 text-sm ${isActive ? "font-bold" : ""}`}>{label}</span>
        )}
      </div>
    </Link>
  );
}

function Sidebar({ isCollapsed, toggleSidebar }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div
      className={`fixed flex flex-col bg-white h-full shadow-md z-40 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-42"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center px-4 py-4">
        <div className="flex items-center">
          <Wallet className="text-primary" size={28} />
          {!isCollapsed && (
            <h1 className="text-primary text-lg  font-bold text-xl ml-2 text-ellipsis max-w-[125px] whitespace-nowrap overflow-hidden">
              Expense Wise
            </h1>
          )}
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-3 bg-white border border-gray-300 rounded-full p-0.5 shadow-md focus:outline-none hover:bg-gray-100 transition-all duration-300 z-50"
      >
        {isCollapsed ? (
          <ChevronRight size={20} className="text-gray-500" />
        ) : (
          <ChevronLeft size={20} className="text-gray-500" />
        )}
      </button>

      {/* Links */}
      <div className="flex-grow">
        <SidebarLink
          label="Dashboard"
          Icon={LayoutDashboard}
          href="/dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          label="Expense"
          Icon={ReceiptIndianRupee}
          href="/expense"
          isCollapsed={isCollapsed}
        />
        <SidebarLink label="Income" Icon={Sprout} href="/income" isCollapsed={isCollapsed} />
        <SidebarLink
          label="Category"
          Icon={LayoutList}
          href="/category"
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Profile Section */}
      {!isCollapsed && (
        <div className="block mb-6 bg-white">
          <div className="flex items-center px-5 mb-4">
            <CircleUserRound className="text-gray-500 mr-3 h-7 w-7" />
            <div>
              <h3 className="text-sm text-black font-semibold">{session?.user.username}</h3>
              <p className="text-gray-500 text-xs">{session?.user.email}</p>
            </div>
          </div>
          {/* Logout Section */}
          <div className="flex items-center px-3 cursor-pointer  hover:text-gray-700">
            <Logout />
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;

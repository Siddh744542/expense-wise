"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  LayoutList,
  Sprout,
  Wallet,
  CircleUserRound,
  LogOut,
  Menu,
} from "lucide-react";
function SidebarLink({ label, Icon, href, isCollapsed }) {
  const pathname = usePathname();
  const isActive =
    pathname == href || (pathname === "/" && href === "/dashboard");
  return (
    <Link href={href} className="flex">
      <div className={`${isActive ? "bg-primary" : "bg-white"} w-1`}></div>
      <div
        className={`flex items-center p-3 px-5 w-full transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-highlight to-white text-primary"
            : "bg-white text-gray-700 hover:bg-background"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        {Icon && (
          <Icon
            className={`h-6 w-6 ${isActive ? "text-primary" : "text-black"}`}
          />
        )}
        {!isCollapsed && (
          <span className={`font-medium ml-3 ${isActive ? "font-bold" : ""}`}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
}
function Sidebar({ isCollapsed, toggleSidebar }) {
  const { data: session } = useSession();
  const router = useRouter();
  function onLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  }
  return (
    <div
      className={`fixed flex flex-col bg-white overflow-hidden h-full shadow-md z-40 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Toggle Icon */}
      <div className="flex justify-start p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>
      {/* Heading */}
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-start px-4"
        }  pt-2`}
      >
        <Wallet className="text-primary" size={32} />
        {!isCollapsed && (
          <h1 className="text-primary font-extrabold text-xl ml-2">
            Expense Wise
          </h1>
        )}
      </div>
      {/* Links */}
      <div className="flex-grow mt-4">
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
        <SidebarLink
          label="Income"
          Icon={Sprout}
          href="/income"
          isCollapsed={isCollapsed}
        />
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
            <CircleUserRound size={38} className="text-gray-500 mr-3" />
            <div>
              <h3 className="text-black font-semibold">
                {session?.user.username}
              </h3>
              <p className="text-gray-500 text-xs">{session?.user.email}</p>
            </div>
          </div>
          {/* Logout Section */}
          <div className="flex items-center px-6 cursor-pointer text-black hover:text-gray-700">
            <LogOut className="mr-2" size={20} />
            <button className="text-sm font-semibold" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Sidebar;

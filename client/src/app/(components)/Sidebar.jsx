"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
//icons
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  ChartSpline,
  LayoutList,
  Sprout,
  Wallet,
  CircleUserRound,
  LogOut,
} from "lucide-react";

function SidebarLink({ label, Icon, href }) {
  const pathname = usePathname();
  const isActive =
    pathname == href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="flex ">
      <div className={`${isActive ? "bg-primary" : "bg-white"} w-1 `}></div>

      <div
        className={`flex items-center p-3 px-5 w-full transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-highlight to-white text-primary"
            : "bg-white text-gray-700 hover:bg-background"
        }`}
      >
        {Icon && (
          <Icon
            className={`h-6 w-6 mr-3 ${
              isActive ? "text-primary" : "text-black"
            }`}
          />
        )}
        <span className={`font-medium ${isActive ? "font-bold" : ""}`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

function Sidebar() {
  const { data: session, status } = useSession();

  return (
    <div className="fixed flex flex-col w-70  bg-white overflow-hidden h-full shadow-md z-40">
      {/* heading */}
      <div className={`flex gap-3 justify-normal items-center pt-8 px-5`}>
        <Wallet className="text-primary" size={35} />
        <h1 className={`text-primary block font-extrabold text-xl `}>
          Expense Wise
        </h1>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-6">
        <SidebarLink
          label={"Dashboard"}
          Icon={LayoutDashboard}
          href={"/dashboard"}
        />
        <SidebarLink
          label={"Expense"}
          Icon={ReceiptIndianRupee}
          href={"/expense"}
        />
        <SidebarLink label={"Income"} Icon={Sprout} href={"/income"} />
        <SidebarLink label={"Charts"} Icon={ChartSpline} href={"/charts"} />
        <SidebarLink label={"Category"} Icon={LayoutList} href={"/category"} />
      </div>
      <div className="block mb-6 bg-white items-center ">
        {/* Profile Section */}
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
          <button className="text-sm font-semibold" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

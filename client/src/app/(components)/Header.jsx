"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
const Header = () => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          ExpenseWise
        </Link>
        <nav className="flex space-x-4">
          <Link
            href="/expense"
            className={`text-white ${isActive("/expense") ? "underline" : ""}`}
          >
            Expense
          </Link>
          <Link
            href="/income"
            className={`text-white ${isActive("/income") ? "underline" : ""}`}
          >
            Income
          </Link>
          <Link
            href="/charts"
            className={`text-white ${isActive("/charts") ? "underline" : ""}`}
          >
            Charts
          </Link>
          <Link
            href="/profile"
            className={`text-white ${isActive("/profile") ? "underline" : ""}`}
          >
            Profile
          </Link>
          <button
            onClick={() => signOut()}
            className={`text-white ${isActive("/profile") ? "underline" : ""}`}
          >
            logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

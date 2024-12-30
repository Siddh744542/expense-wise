import DashboardWrapper, { Loader } from "./dashboardWrapper";
import "./globals.css";
import { Roboto } from "next/font/google";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
const roboto = Roboto({
  weight: ["400", "300", "100"],
  subsets: ["latin"],
  variable: "--font-roboto"
});
export const metadata = {
  title: "ExpenseWise - Personal Expense Tracker",
  description: "Track your income and expenses, set budgets, and get insights with ExpenseWise."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Suspense fallback={<Loader />}>
          <SessionProviderWrapper>
            <DashboardWrapper>
              <Toaster />
              {children}
            </DashboardWrapper>
          </SessionProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}

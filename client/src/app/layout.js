import DashboardWrappper from "./dashboardWrapper";
import "./globals.css";
import { Roboto } from "next/font/google";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { Toaster } from "react-hot-toast";
const roboto = Roboto({
  weight: ["400", "300", "100"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
export const metadata = {
  title: "ExpenseWise - Personal Expense Tracker",
  description:
    "Track your income and expenses, set budgets, and get insights with ExpenseWise.",
};
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <SessionProviderWrapper>
          <DashboardWrappper>
            <Toaster />
            {children}
          </DashboardWrappper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

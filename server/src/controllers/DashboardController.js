import MonthlyExpense from "../../models/monthlyExpense.js";
import MonthlyIncome from "../../models/monthlyIncome.js";
import { getExpenseComparisonData } from "../../utils/getComparisonData.js";
import { getExpenseSummaryData } from "./expenseController.js";
import { getIncomeSummaryData } from "./incomeController.js";

export const getDashboardData = async (req, res) => {
  const { userId, month } = req.query;
  if (!userId || !month) {
    return res.status(400).json({ message: "User ID and month are required." });
  }
  try {
    let monthlyIncomeSummary = await getIncomeSummaryData(userId, month);

    let monthlyExpenseSummary = await getExpenseSummaryData(userId, month);

    const comparisonData = await getExpenseComparisonData(userId, month);
    const data = {
      expenseData: monthlyExpenseSummary || [],
      incomeData: {
        totalIncome: monthlyIncomeSummary?.totalIncome || 0,
        sources: monthlyIncomeSummary?.sources || [],
      },
      comparisonData: comparisonData || [],
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
};

export const getMonths = async (req, res) => {
  try {
    const { userId } = req.query;
    const availableExpenseMonths = await MonthlyExpense.distinct("month", {
      userId,
    });
    const availableIncomeMonths = await MonthlyIncome.distinct("month", {
      userId,
    });
    const largerMonthsArray =
      availableExpenseMonths.length >= availableIncomeMonths.length
        ? availableExpenseMonths
        : availableIncomeMonths;

    res.status(200).json({ months: largerMonthsArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve months" });
  }
};

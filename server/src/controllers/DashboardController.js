import mongoose from "mongoose";
import MonthlyExpense from "../../models/monthlyExpense.js";
import MonthlyIncome from "../../models/monthlyIncome.js";

export const getDashboardData = async (req, res) => {};

export const getMonths = async (req, res) => {
  console.log("you were here");

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

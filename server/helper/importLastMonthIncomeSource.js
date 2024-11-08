import mongoose from "mongoose";
import MonthlyIncome from "../models/monthlyIncome.js";

export const importLastMonthIncomeSources = async (userId) => {
  try {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const lastMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(
      lastMonthDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const lastMonthIncome = await MonthlyIncome.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: lastMonth,
    });

    if (!lastMonthIncome) {
      console.log("No income sources to import from last month.");
      return null;
    }
    const newIncomeData = new MonthlyIncome({
      userId,
      month: currentMonth,
      sources: lastMonthIncome.sources.map((source) => ({
        source: source.source,
        total: 0,
      })),
    });

    await newIncomeData.save();
    return newIncomeData;
  } catch (error) {
    console.error("Error importing income sources from last month:", error);
    throw error;
  }
};

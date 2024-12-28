import mongoose from "mongoose";
import MonthlyExpense from "../models/monthlyExpense.js";

async function importCategoriesFromLastMonth(userId) {
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

    const lastMonthExpense = await MonthlyExpense.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: lastMonth,
    });

    if (!lastMonthExpense) {
      return { success: false, message: "No data found for last month." };
    }

    const newCategoryExpenses = lastMonthExpense.categoryExpenses.map(
      (categoryExpense) => ({
        category: categoryExpense.category,
        amount: 0,
        limit: categoryExpense.limit,
      })
    );

    const newMonthlyExpense = new MonthlyExpense({
      userId,
      month: currentMonth,
      categoryExpenses: newCategoryExpenses,
    });

    await newMonthlyExpense.save();
    return newMonthlyExpense;
  } catch (error) {
    console.error("Error importing categories and limits:", error);
    return {
      success: false,
      message: "Failed to import categories and limits.",
    };
  }
}

export default importCategoriesFromLastMonth;

import importCategoriesFromLastMonth from "../../helper/importCategoriesFromLastMonth.js";
import DailyExpense from "../../models/dailyExpense.js";

import MonthlyExpense from "../../models/monthlyExpense.js";

export const getSummary = async (req, res) => {
  const { userId, month } = req.query;
  try {
    let monthlySummary = await MonthlyExpense.findOne({
      userId: userId,
      month,
    });

    const availableMonths = await MonthlyExpense.distinct("month", { userId });

    if (!monthlySummary) {
      const importResult = await importCategoriesFromLastMonth(userId);

      if (importResult.success) {
        monthlySummary = await MonthlyExpense.findOne({
          userId: userId,
          month,
        });
      } else {
        return res.status(500).json({ message: importResult.message });
      }
    }

    if (!monthlySummary) {
      return res.json({
        categoryExpenses: [],
        totalExpenses: 0,
        availableMonths,
      });
    }

    const totalExpenses = monthlySummary.categoryExpenses.reduce(
      (sum, category) => sum + category.amount,
      0
    );
    res.json({
      totalExpenses,
      categoryExpenses: monthlySummary.categoryExpenses,
      availableMonths,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Failed to fetch summary." });
  }
};

const updateMonthlyExpense = async (expenseData) => {
  try {
    const { userId, date, category, amount } = expenseData;

    const amountNumber = Number(amount);

    const month = new Date(date).toISOString().substring(0, 7);
    let monthlyExpense = await MonthlyExpense.findOne({ userId, month });

    if (!monthlyExpense) {
      monthlyExpense = new MonthlyExpense({
        userId,
        month,
        categoryExpenses: [
          {
            category,
            amount: amountNumber,
            limit: 0,
          },
        ],
      });
    } else {
      const categoryIndex = monthlyExpense.categoryExpenses.findIndex(
        (cat) => cat.category === category
      );

      if (categoryIndex !== -1) {
        monthlyExpense.categoryExpenses[categoryIndex].amount += amountNumber;
      } else {
        monthlyExpense.categoryExpenses.push({
          category,
          amount: amountNumber,
          limit: 0,
        });
      }
    }
    await monthlyExpense.save();
    console.log("Monthly expense updated:", monthlyExpense);
  } catch (err) {
    console.error("Error updating monthly expense:", err);
  }
};

export const addExpense = async (req, res) => {
  try {
    const expenseData = req.body;
    const newExpense = new DailyExpense(expenseData);

    await newExpense.save();
    await updateMonthlyExpense(expenseData);

    return res.status(200).json({
      message: "Expense saved",
      success: true,
      newExpense,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const skip = (page - 1) * limit;
    const expenses = await DailyExpense.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get the total count of expenses for the user (for pagination calculation)
    const totalExpenses = await DailyExpense.countDocuments({ userId });

    const totalPages = Math.ceil(totalExpenses / limit);

    res.status(200).json({
      expenses,
      currentPage: page,
      totalPages,
      totalExpenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.body;

    const expense = await DailyExpense.findOneAndDelete({
      _id: expenseId,
      userId: userId,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found or doesn't belong to the user" });
    }
    const expenseDate = new Date(expense.date);
    const monthYear = `${expenseDate.getFullYear()}-${(
      "0" +
      (expenseDate.getMonth() + 1)
    ).slice(-2)}`; // Format: 'YYYY-MM'

    const monthlySummary = await MonthlyExpense.findOne({
      userId: userId,
      month: monthYear,
    });

    if (monthlySummary) {
      const category = monthlySummary.categoryExpenses.find(
        (cat) => cat.category === expense.category
      );
      if (category) {
        category.amount -= expense.amount;
        if (category.amount < 0) {
          category.amount = 0;
        }
        await monthlySummary.save();
      }
    }
    res
      .status(200)
      .json({ message: "Expense deleted successfully", expenseId });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense" });
  }
};
export const updateExpense = async (req, res) => {
  try {
    const { userId, expenseId, ...formData } = req.body;
    const oldExpense = await DailyExpense.findOne({ _id: expenseId, userId });

    if (!oldExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or doesn't belong to the user" });
    }
    const updatedExpense = await DailyExpense.findOneAndUpdate(
      { _id: expenseId, userId: userId },
      { $set: formData },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense update failed" });
    }

    const oldExpenseDate = new Date(oldExpense.date);
    const updatedExpenseDate = new Date(updatedExpense.date);
    const oldMonthYear = `${oldExpenseDate.getFullYear()}-${(
      "0" +
      (oldExpenseDate.getMonth() + 1)
    ).slice(-2)}`;
    const updatedMonthYear = `${updatedExpenseDate.getFullYear()}-${(
      "0" +
      (updatedExpenseDate.getMonth() + 1)
    ).slice(-2)}`;

    if (
      oldMonthYear !== updatedMonthYear ||
      oldExpense.category !== updatedExpense.category ||
      oldExpense.amount !== updatedExpense.amount
    ) {
      const oldMonthlySummary = await MonthlyExpense.findOne({
        userId: userId,
        month: oldMonthYear,
      });

      if (oldMonthlySummary) {
        const oldCategory = oldMonthlySummary.categoryExpenses.find(
          (cat) => cat.category === oldExpense.category
        );
        if (oldCategory) {
          oldCategory.amount -= oldExpense.amount;
          if (oldCategory.amount < 0) oldCategory.amount = 0;

          oldMonthlySummary.totalExpenses -= oldExpense.amount;
          if (oldMonthlySummary.totalExpenses < 0)
            oldMonthlySummary.totalExpenses = 0;

          await oldMonthlySummary.save();
        }
      }
      const updatedMonthlySummary = await MonthlyExpense.findOneAndUpdate(
        { userId: userId, month: updatedMonthYear },
        {
          $setOnInsert: { userId, month: updatedMonthYear },
          $inc: { totalExpenses: updatedExpense.amount },
        },
        { upsert: true, new: true }
      );

      const updatedCategory = updatedMonthlySummary.categoryExpenses.find(
        (cat) => cat.category === updatedExpense.category
      );
      if (updatedCategory) {
        updatedCategory.amount += updatedExpense.amount;
      } else {
        updatedMonthlySummary.categoryExpenses.push({
          category: updatedExpense.category,
          amount: updatedExpense.amount,
        });
      }

      await updatedMonthlySummary.save();
    }

    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

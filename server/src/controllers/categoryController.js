import MonthlyExpense from "../../models/monthlyExpense.js";
import DailyExpense from "../../models/dailyExpense.js";
import mongoose from "mongoose";

export const addcategory = async (req, res) => {
  const { userId, category, limit, month } = req.body;

  if (!userId || !category || !limit || !month) {
    return res.status(400).json({
      message: "All fields (userId, category, limit, and month) are required.",
    });
  }

  try {
    const selectedMonth = month;

    let monthlyExpense = await MonthlyExpense.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: selectedMonth,
    });

    if (!monthlyExpense) {
      monthlyExpense = new MonthlyExpense({
        userId: new mongoose.Types.ObjectId(userId),
        month: selectedMonth,
        categoryExpenses: [{ category, limit, amount: 0 }],
      });
    } else {
      const existingCategory = monthlyExpense.categoryExpenses.find(
        (cat) => cat.category === category
      );

      if (existingCategory) {
        return res.status(400).json({
          message: "Category already exists for the selected month.",
        });
      }

      monthlyExpense.categoryExpenses.push({ category, limit, amount: 0 });
    }
    await monthlyExpense.save();

    res.status(200).json({ message: "Category added successfully!" });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateCategory = async (req, res) => {
  const { userId, categoryId, category, limit, month } = req.body;

  if (!userId || !categoryId || (!category && limit === undefined) || !month) {
    return res.status(400).json({ message: "Required fields are missing." });
  }
  try {
    const selectedMonth = month;
    let monthlyExpense = await MonthlyExpense.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: selectedMonth,
    });

    if (!monthlyExpense) {
      return res.status(404).json({
        message: "No monthly expenses found in the selected month.",
      });
    }

    const categoryToUpdate = monthlyExpense.categoryExpenses.id(categoryId);
    if (!categoryToUpdate) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }
    if (category) {
      categoryToUpdate.category = category;
    }
    if (limit !== undefined) {
      categoryToUpdate.limit = limit;
    }

    await monthlyExpense.save();
    res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteCategory = async (req, res) => {
  const { userId, categoryId, deleteExpenses } = req.body;

  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpense = await MonthlyExpense.findOne({
      userId,
      month: currentMonth,
    });

    if (!monthlyExpense) {
      return res.status(404).json({ message: "Monthly expense not found" });
    }

    const categoryToDelete = monthlyExpense.categoryExpenses.find(
      (expense) => expense._id.toString() === categoryId
    );

    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategories = monthlyExpense.categoryExpenses.filter(
      (expense) => expense._id.toString() !== categoryId
    );

    monthlyExpense.categoryExpenses = updatedCategories;
    await monthlyExpense.save();

    if (deleteExpenses) {
      await DailyExpense.deleteMany({
        userId,
        category: categoryToDelete.category,
      });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getComparisonData = async (req, res) => {
  const { userId, month } = req.query;

  if (!userId || !month) {
    return res.status(400).json({ message: "User ID and month are required." });
  }

  try {
    const thisMonthData = await MonthlyExpense.findOne({ userId, month });
    const lastMonth = new Date(
      new Date(month).setMonth(new Date(month).getMonth() - 1)
    );
    const lastMonthString = lastMonth.toISOString().slice(0, 7); // Format: 'YYYY-MM'

    const lastMonthData = await MonthlyExpense.findOne({
      userId,
      month: lastMonthString,
    });

    if (!lastMonthData) {
      return res
        .status(404)
        .json({ message: "No data available for the last month." });
    }

    const comparisonData = [];
    const categories = new Set();

    thisMonthData?.categoryExpenses.forEach((expense) => {
      categories.add(expense.category);
      comparisonData.push({
        category: expense.category,
        lastMonth:
          lastMonthData?.categoryExpenses.find(
            (item) => item.category === expense.category
          )?.amount || 0,
        thisMonth: expense.amount,
      });
    });

    lastMonthData.categoryExpenses.forEach((expense) => {
      if (!categories.has(expense.category)) {
        comparisonData.push({
          category: expense.category,
          lastMonth: expense.amount,
          thisMonth: 0,
        });
      }
    });

    res.status(200).json(comparisonData);
  } catch (err) {
    console.error("Error fetching monthly expenses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

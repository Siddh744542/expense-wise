import mongoose from "mongoose";
import MonthlyIncome from "../../models/monthlyIncome.js";
import DailyIncome from "../../models/incomeModel.js";

export const addIncomeSource = async (req, res) => {
  const { userId, source, month } = req.body;
  if (!userId || !source || !month) {
    return res.status(400).json({
      message: "All fields (userId, source and month) are required.",
    });
  }

  try {
    let monthlyIncome = await MonthlyIncome.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month,
    });

    if (monthlyIncome) {
      const existingSource = monthlyIncome.sources.some(
        (s) => s.source === source
      );

      if (existingSource) {
        return res.status(400).json({
          message: "Source already exists for this month.",
        });
      }

      monthlyIncome.sources.push({ source, total: 0 });
      await monthlyIncome.save();
    } else {
      monthlyIncome = new MonthlyIncome({
        userId,
        month,
        totalIncome: 0,
        sources: [{ source, total: 0 }],
      });
      await monthlyIncome.save();
    }

    res
      .status(200)
      .json({ message: "Income source added successfully", monthlyIncome });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while adding income source" });
  }
};
export const deleteIncomeSource = async (req, res) => {
  const { userId, sourceId, deleteIncomes, month } = req.body;
  try {
    const monthlyIncome = await MonthlyIncome.findOne({
      userId,
      month: month,
    });

    if (!monthlyIncome) {
      return res.status(404).json({ message: "Monthly income not found" });
    }

    const sourceToDelete = monthlyIncome.sources.find(
      (source) => source._id.toString() === sourceId
    );

    if (!sourceToDelete) {
      return res.status(404).json({ message: "Source not found" });
    }

    const updatedSources = monthlyIncome.sources.filter(
      (source) => source._id.toString() !== sourceId
    );

    monthlyIncome.sources = updatedSources;
    await monthlyIncome.save();

    if (deleteIncomes) {
      await DailyIncome.deleteMany({
        userId,
        source: sourceToDelete.source,
      });
    }

    return res.status(200).json({ message: "Source deleted successfully" });
  } catch (error) {
    console.error("Error deleting Source:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateIncomeSource = async (req, res) => {
  const { userId, sourceId, source, month } = req.body;

  if (!userId || !sourceId || !source === undefined || !month) {
    return res.status(400).json({ message: "Required fields are missing." });
  }
  try {
    let monthlyIncome = await MonthlyIncome.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: month,
    });

    if (!monthlyIncome) {
      return res.status(404).json({
        message: "No monthly income found in the selected month.",
      });
    }

    const sourceToUpdate = monthlyIncome.sources.id(sourceId);
    if (!sourceToUpdate) {
      return res.status(404).json({
        message: "income source not found.",
      });
    }
    if (source) {
      sourceToUpdate.source = source;
    }
    await monthlyIncome.save();
    res.status(200).json({ message: "Income source updated successfully!" });
  } catch (error) {
    console.error("Error updating income Source:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const getComparisonData = async (req, res) => {
  const { userId, month } = req.query;

  if (!userId || !month) {
    return res.status(400).json({ message: "User ID and month are required." });
  }

  try {
    const thisMonthData = await MonthlyIncome.findOne({ userId, month });
    const lastMonth = new Date(
      new Date(month).setMonth(new Date(month).getMonth() - 1)
    );
    const lastMonthString = lastMonth.toISOString().slice(0, 7); // Format: 'YYYY-MM'

    const lastMonthData = await MonthlyIncome.findOne({
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

    thisMonthData?.sources.forEach((source) => {
      categories.add(source.source);
      comparisonData.push({
        source: source.source,
        lastMonth:
          lastMonthData?.sources.find((item) => item.source === source.source)
            ?.total || 0,
        thisMonth: source.total,
      });
    });

    lastMonthData.sources.forEach((source) => {
      if (!categories.has(source.source)) {
        comparisonData.push({
          category: source.source,
          lastMonth: source.total,
          thisMonth: 0,
        });
      }
    });

    res.status(200).json(comparisonData);
  } catch (err) {
    console.error("Error fetching monthly income:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

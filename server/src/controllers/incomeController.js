import { importLastMonthIncomeSources } from "../../helper/importLastMonthIncomeSource.js";
import DailyIncome from "../../models/incomeModel.js";
import MonthlyIncome from "../../models/monthlyIncome.js";

const updateMonthlyIncome = async (incomeData) => {
  const { userId, amount, source, date } = incomeData;
  const amountNumber = Number(amount);

  const month = new Date(date).toISOString().substring(0, 7);

  try {
    let monthlyIncome = await MonthlyIncome.findOne({ userId, month });

    if (monthlyIncome) {
      const sourceIndex = monthlyIncome.sources.findIndex(
        (s) => s.source === source
      );

      if (sourceIndex !== -1) {
        monthlyIncome.sources[sourceIndex].total += amountNumber;
      } else {
        monthlyIncome.sources.push({ source, total: amountNumber });
      }
      monthlyIncome.totalIncome += amountNumber;

      await monthlyIncome.save();
    } else {
      monthlyIncome = new MonthlyIncome({
        userId,
        month,
        totalIncome: amountNumber,
        sources: [{ source, total: amountNumber }],
      });

      await monthlyIncome.save();
    }
  } catch (error) {
    console.error("Error updating monthly income:", error);
    throw new Error("Could not update monthly income");
  }
};

export const addIncome = async (req, res) => {
  try {
    const incomeData = req.body;
    const newIncome = new DailyIncome(incomeData);

    await newIncome.save();
    await updateMonthlyIncome(incomeData);

    return res.status(200).json({
      message: "Income saved",
      success: true,
      newIncome,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSummary = async (req, res) => {
  const { userId, month } = req.query;

  try {
    let monthlySummary = await MonthlyIncome.findOne({ userId, month });
    if (!monthlySummary) {
      monthlySummary = await importLastMonthIncomeSources(userId, month);
    }
    const availableMonths = await MonthlyIncome.distinct("month", { userId });

    if (!monthlySummary) {
      return res.json({ sources: [], totalIncome: 0, availableMonths });
    }
    res.json({
      totalIncome: monthlySummary.totalIncome,
      sources: monthlySummary.sources,
      availableMonths,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Failed to fetch summary." });
  }
};

export const getIncome = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const skip = (page - 1) * limit;

    const incomes = await DailyIncome.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalIncomes = await DailyIncome.countDocuments({ userId });

    const totalPages = Math.ceil(totalIncomes / limit);

    res.status(200).json({
      incomes,
      currentPage: page,
      totalPages,
      totalIncomes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { userId, incomeId } = req.body;

    const income = await DailyIncome.findOneAndDelete({
      _id: incomeId,
      userId: userId,
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found or doesn't belong to the user",
      });
    }

    const incomeDate = new Date(income.date);
    const monthYear = `${incomeDate.getFullYear()}-${(
      "0" +
      (incomeDate.getMonth() + 1)
    ).slice(-2)}`;

    const monthlySummary = await MonthlyIncome.findOne({
      userId: userId,
      month: monthYear,
    });

    if (monthlySummary) {
      const source = monthlySummary.sources.find(
        (src) => src.source === income.source
      );
      if (source) {
        source.total -= income.amount;
        if (source.total < 0) {
          source.total = 0;
        }
        monthlySummary.totalIncome -= income.amount;
        if (monthlySummary.totalIncome < 0) {
          monthlySummary.totalIncome = 0;
        }
        await monthlySummary.save();
      }
    }

    res.status(200).json({ message: "Income deleted successfully", incomeId });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { userId, incomeId, ...formData } = req.body;
    const oldIncome = await DailyIncome.findOne({ _id: incomeId, userId });

    if (!oldIncome) {
      return res
        .status(404)
        .json({ message: "Income not found or doesn't belong to the user" });
    }

    const updatedIncome = await DailyIncome.findOneAndUpdate(
      { _id: incomeId, userId: userId },
      { $set: formData },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income update failed" });
    }

    const oldIncomeDate = new Date(oldIncome.date);
    const updatedIncomeDate = new Date(updatedIncome.date);
    const oldMonthYear = `${oldIncomeDate.getFullYear()}-${(
      "0" +
      (oldIncomeDate.getMonth() + 1)
    ).slice(-2)}`;
    const updatedMonthYear = `${updatedIncomeDate.getFullYear()}-${(
      "0" +
      (updatedIncomeDate.getMonth() + 1)
    ).slice(-2)}`;

    if (
      oldMonthYear !== updatedMonthYear ||
      oldIncome.source !== updatedIncome.source ||
      oldIncome.amount !== updatedIncome.amount
    ) {
      const oldMonthlySummary = await MonthlyIncome.findOne({
        userId: userId,
        month: oldMonthYear,
      });

      if (oldMonthlySummary) {
        const oldSource = oldMonthlySummary.sources.find(
          (src) => src.source === oldIncome.source
        );
        if (oldSource) {
          oldSource.total -= oldIncome.amount;
          if (oldSource.total < 0) oldSource.total = 0;

          oldMonthlySummary.totalIncome -= oldIncome.amount;
          if (oldMonthlySummary.totalIncome < 0)
            oldMonthlySummary.totalIncome = 0;

          await oldMonthlySummary.save();
        }
      }

      const updatedMonthlySummary = await MonthlyIncome.findOneAndUpdate(
        { userId: userId, month: updatedMonthYear },
        {
          $setOnInsert: { userId, month: updatedMonthYear },
          $inc: { totalIncome: updatedIncome.amount },
        },
        { upsert: true, new: true }
      );
      const updatedSource = updatedMonthlySummary.sources.find(
        (src) => src.source === updatedIncome.source
      );
      if (updatedSource) {
        updatedSource.total += updatedIncome.amount;
      } else {
        updatedMonthlySummary.sources.push({
          source: updatedIncome.source,
          total: updatedIncome.amount,
        });
      }

      await updatedMonthlySummary.save();
    }

    res
      .status(200)
      .json({ message: "Income updated successfully", updatedIncome });
  } catch (error) {
    res.status(500).json({ message: "Error updating income", error });
  }
};

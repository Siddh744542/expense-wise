import MonthlyExpense from "../models/monthlyExpense.js";
import MonthlyIncome from "../models/monthlyIncome.js";

export const getExpenseComparisonData = async (userId, month) => {
  try {
    // Fetch data for the current month
    const thisMonthData = await MonthlyExpense.findOne({ userId, month });

    // Calculate and format the last month string
    const lastMonth = new Date(
      new Date(month).setMonth(new Date(month).getMonth() - 1)
    );
    const lastMonthString = lastMonth.toISOString().slice(0, 7); // Format: 'YYYY-MM'

    // Fetch data for the last month
    const lastMonthData = await MonthlyExpense.findOne({
      userId,
      month: lastMonthString,
    });

    // Initialize comparison data
    const comparisonData = [];
    const categories = new Set();

    // Add data for this month's categories
    if (thisMonthData) {
      thisMonthData.categoryExpenses.forEach((expense) => {
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
    }

    // Add data for last month's categories not in this month
    if (lastMonthData) {
      lastMonthData.categoryExpenses.forEach((expense) => {
        if (!categories.has(expense.category)) {
          comparisonData.push({
            category: expense.category,
            lastMonth: expense.amount,
            thisMonth: 0,
          });
        }
      });
    }

    return comparisonData;
  } catch (err) {
    console.error("Error fetching monthly expenses:", err);
    throw new Error("Unable to fetch expense comparison data.");
  }
};

export const getIncomeComparisonData = async (userId, month) => {
  try {
    // Fetch data for the current month
    const thisMonthData = await MonthlyIncome.findOne({ userId, month });

    // Calculate and format the last month's date string
    const lastMonth = new Date(
      new Date(month).setMonth(new Date(month).getMonth() - 1)
    );
    const lastMonthString = lastMonth.toISOString().slice(0, 7); // Format: 'YYYY-MM'

    // Fetch data for the last month
    const lastMonthData = await MonthlyIncome.findOne({
      userId,
      month: lastMonthString,
    });

    // Initialize comparison data
    const comparisonData = [];
    const categories = new Set();

    // Add data for this month's sources
    if (thisMonthData) {
      thisMonthData.sources.forEach((source) => {
        categories.add(source.source);
        comparisonData.push({
          source: source.source,
          lastMonth:
            lastMonthData?.sources.find((item) => item.source === source.source)
              ?.total || 0,
          thisMonth: source.total,
        });
      });
    }

    // Add data for last month's sources not in this month
    if (lastMonthData) {
      lastMonthData.sources.forEach((source) => {
        if (!categories.has(source.source)) {
          comparisonData.push({
            source: source.source,
            lastMonth: source.total,
            thisMonth: 0,
          });
        }
      });
    }

    return comparisonData;
  } catch (err) {
    console.error("Error fetching monthly income comparison:", err);
    throw new Error("Unable to fetch income comparison data.");
  }
};

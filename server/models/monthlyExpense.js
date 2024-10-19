import mongoose from "mongoose";

const monthlyExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      // Format: 'YYYY-MM'
      type: String,
      required: true,
    },
    categoryExpenses: [
      {
        category: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        limit: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

monthlyExpenseSchema.index({ userId: 1, month: 1 });

const MonthlyExpense = mongoose.model("MonthlyExpense", monthlyExpenseSchema);

export default MonthlyExpense;

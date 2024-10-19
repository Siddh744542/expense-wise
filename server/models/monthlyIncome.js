import mongoose from "mongoose";
const monthlyIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    totalIncome: {
      type: Number,
      default: 0,
      required: true,
    },
    sources: [
      {
        source: {
          type: String,
          required: true,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MonthlyIncome = mongoose.model("MonthlyIncome", monthlyIncomeSchema);
export default MonthlyIncome;

import { Router } from "express";
import {
  addExpense,
  getSummary,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../controllers/expenseController.js";
const router = Router();

router.get("/getexpense", getExpenses); //http://localhost:8000/expense/
router.get("/summary", getSummary); //http://localhost:8000/expense/summary
router.post("/addexpense", addExpense); //http://localhost:8000/expense/addexpense
router.delete("/deleteexpense", deleteExpense); //http://localhost:8000/expense/deleteexpense
router.put("/updateexpense", updateExpense);
export default router;

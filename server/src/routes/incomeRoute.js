import { Router } from "express";
import {
  addIncome,
  deleteIncome,
  getIncome,
  getSummary,
  updateIncome,
} from "../controllers/incomeController.js";

const router = Router();

router.get("/summary", getSummary);
router.get("/getincome", getIncome);
router.post("/addIncome", addIncome);
router.delete("/deleteincome", deleteIncome);
router.put("/updateincome", updateIncome);
export default router;

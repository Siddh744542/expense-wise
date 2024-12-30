import { Router } from "express";
import {
  addIncome,
  deleteIncome,
  getIncome,
  getIncomeSummary,
  updateIncome,
  getSources,
} from "../controllers/incomeController.js";

const router = Router();

router.get("/summary", getIncomeSummary);
router.get("/getincome", getIncome);
router.get("/getsources", getSources);
router.post("/addIncome", addIncome);
router.delete("/deleteincome", deleteIncome);
router.put("/updateincome", updateIncome);

export default router;

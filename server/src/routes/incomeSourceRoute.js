import { Router } from "express";
import {
  addIncomeSource,
  deleteIncomeSource,
  updateIncomeSource,
  getComparisonData,
} from "../controllers/incomeSourceController.js";

const router = Router();

router.get("/getcomparisondata", getComparisonData);
router.post("/add", addIncomeSource);
router.put("/update", updateIncomeSource);
router.delete("/delete", deleteIncomeSource);

export default router;

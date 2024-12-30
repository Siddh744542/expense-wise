import { Router } from "express";
import {
  addIncomeSource,
  deleteIncomeSource,
  updateIncomeSource,
  getSourceData,
} from "../controllers/incomeSourceController.js";

const router = Router();

router.get("/", getSourceData);
router.post("/add", addIncomeSource);
router.put("/update", updateIncomeSource);
router.delete("/delete", deleteIncomeSource);

export default router;

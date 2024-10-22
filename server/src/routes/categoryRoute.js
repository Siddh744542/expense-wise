import { Router } from "express";
import {
  addcategory,
  deleteCategory,
  updateCategory,
  getDailyTrendsData,
} from "../controllers/categoryController.js";

const router = Router();

router.post("/addcategory", addcategory);
router.put("/updatecategory", updateCategory);
router.delete("/delete", deleteCategory);
router.get("/dailytrends", getDailyTrendsData);
export default router;

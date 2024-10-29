import { Router } from "express";
import {
  addcategory,
  deleteCategory,
  updateCategory,
  getComparisonData,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/getcomparisondata", getComparisonData);
router.post("/addcategory", addcategory);
router.put("/updatecategory", updateCategory);
router.delete("/delete", deleteCategory);

export default router;

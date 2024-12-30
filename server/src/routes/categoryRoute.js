import { Router } from "express";
import {
  addcategory,
  deleteCategory,
  updateCategory,
  getCategoryData,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategoryData);
router.post("/addcategory", addcategory);
router.put("/updatecategory", updateCategory);
router.delete("/delete", deleteCategory);

export default router;

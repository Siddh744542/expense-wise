import { Router } from "express";
import {
  addcategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.post("/addcategory", addcategory);
router.put("/updatecategory", updateCategory);
router.delete("/delete", deleteCategory);
export default router;

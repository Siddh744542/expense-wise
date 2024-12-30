import { Router } from "express";
import {
  getMonths,
  getDashboardData,
} from "../controllers/DashboardController.js";
const router = new Router();

router.get("/getavailablemonths", getMonths);
router.get("/", getDashboardData);
export default router;

import { Router } from "express";
import { getMonths } from "../controllers/DashboardController.js";
const router = new Router();

router.get("/getavailablemonths", getMonths);
export default router;

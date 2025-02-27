import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connect } from "./dbConfig/dbConfig.js";
// route imports
import userRoutes from "../src/routes/userRoutes.js";
import expenseRoutes from "../src/routes/expenseRoute.js";
import incomeRoutes from "../src/routes/incomeRoute.js";
import categoryRoutes from "../src/routes/categoryRoute.js";
import incomeSourceRoutes from "../src/routes/incomeSourceRoute.js";
import dashBoardRoutes from "../src/routes/DashboardRoute.js";
// configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

app.use(cookieParser());
connect();
// routes
app.use("/users", userRoutes); //http://localhost:8000/users
app.use("/expense", expenseRoutes); //http://localhost:8000/expense
app.use("/income", incomeRoutes); //http://localhost:8000/income
app.use("/category", categoryRoutes); //http://localhost:8000/category
app.use("/incomesource", incomeSourceRoutes); //http://localhost:8000/incomesource
app.use("/dashboard", dashBoardRoutes);
// server
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`server running on port ${port}`);
});

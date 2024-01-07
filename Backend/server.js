import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDb from "./config/db.js";
dotenv.config({ path: "./.env" });

const app = express();
//Database connection
connectDb();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser())

const port = process.env.PORT || 5000;

//middleware
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(errorHandler);
app.use(notFound);
app.listen(port, (req, res) => {
  console.log(`Listening at ${port}`);
});

import express from "express";
import path from "path";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDb from "./config/db.js";
import cors from "cors";
dotenv.config({ path: "./.env" });

const app = express();
//Database connection
connectDb();

app.use(
  cors({
    origin:"https://mern-auth-flax-tau.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT || 5000;

//middleware
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is ready");
  });
}

app.use(errorHandler);
app.use(notFound);
app.listen(port, (req, res) => {
  console.log(`Listening at ${port}`);
});

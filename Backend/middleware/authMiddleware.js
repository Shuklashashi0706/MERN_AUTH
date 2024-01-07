import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";
import userModel from "../models/userModel.js";

const protect = asynchandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.userId).select("-password"); //returns the user from database and stores it in req.user
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized,no token");
  }
});
export { protect };

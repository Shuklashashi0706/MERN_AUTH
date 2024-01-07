import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateTokens.js";

// @desc Auth user/set Token
//@route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// @desc Register a new user
//@route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await userModel.create({
    name: name,
    email: email,
    password: password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Logout a user
// @route POST /api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({message:"Logged out"})
});

// @desc GET user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id:req.user._id,
    name:req.user.name,
    email:req.user.email
  }
  res.status(200).json({ message: "User Profile",user });
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  const {name,email} = req.body;
  if(user){
      user.name = name || user.name;
      user.email = email || user.email;
      if(req.body.password){
        user.password = req.body.password;
      }
      const updateUser = await user.save();
      res.status(200).json({
        _id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email
      })
  }else{
    res.status(400);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

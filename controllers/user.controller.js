const router = require("express").Router();
const User = require("../models/user.model");
const { issueJWT, verifyJWT } = require("../utils/authUtils");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    const existing = await User.findOne({
      email: req.body.email,
    });
    if (existing)
      return res.status(409).json({
        description: "This Email ID is already registered, Please Login.",
        response: existing,
      });
    const { userName, email, contact, password, role } = req.body;
    try {
      const user = await new User({
        userName,
        email,
        contact,
        password,
        role,
      }).save();
      return res.json({
        description: "New User Registered Successfully!",
        response: user,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ description: "Failed to save new user.", error });
    }
  } catch (error) {
    return res.status(500).json({ description: "Something Went Wrong", erroe });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ description: "You are not registered.", response: null });
    else {
      const match = await user.validatePassword(password);
      if (!match)
        res.status(401).json({ description: "Incorrect Credentials." });
      else {
        const token = issueJWT(user);
        res.json({
          description: "Login Successful",
          response: { token },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ description: "Something went wrong", error });
  }
});

module.exports = router;

const { on } = require("events");
const { upsertStreamUser } = require("../db/stream");
const User = require("../models/user.model");
const { userService } = require("../services");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res) => {
    try {
      const { fullName, password, email } = req.body;

      // Handle signup logic here

      const exitingUser = await userService.getOne({ email });
      if (exitingUser) {
        return res.status(404).json({ message: "User already exists" });
      }

      const idx = Math.floor(Math.random() * 100) + 1; // genrate a num between 1-100
      const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

      const newUser = {
        fullName,
        password,
        email,
        profilePic: randomAvatar,
      };

      // stream

      const user = await userService.create(newUser);

      try {
        console.log("############ ", {
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });
        const result = await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });
        console.log("##############result############", result);
        console.log("Stream user created successfully");
      } catch (error) {
        console.error("Error creating stream user:", error);
        await User.deleteOne({ _id: user._id });
        return res.status(500).json({ message: "Error creating stream user" });
      }
      if (!user) {
        return res.status(500).json({ message: "Error creating user" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // prevent xss attacks,
        sameSite: "strict", // prevent csrf attacks ,
        // scure: true,
      });
      res.status(200).json({
        success: true,
        message: "Signup successful",
        data: user,
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error in Signup Controller", error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userService.getOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or Password" });
      }
      const isPasswordCorrect = await user.matchPassword(password);

      if (!isPasswordCorrect) {
        return res.status(404).json({ message: "Invalid email or Password" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // prevent xss attacks,
        sameSite: "strict", // prevent csrf attacks ,
        // scure: true,
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      // Handle logout logic here
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 onboarding: async (req, res) => {
  try {
    const { nativeLanguage, learningLanguage, location } = req.body;

    const user = await userService.update(
      { _id: req.user._id },
      {
        nativeLanguage,
        learningLanguage,
        location,
        isOnBoarded: true,
      }
    );
    


    if (!user) {
      return res.status(500).json({ error: "Error updating user" });
    }

    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || "",
    });

    return res.status(200).json({
      success: true,
      message: "Onboarding successful",
      data: user,
    });

  } catch (error) {
    console.error("Onboarding error:", error);

  }
},



};

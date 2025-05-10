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

      const newUSer = {
        fullName,
        password,
        email,
        avatar: randomAvatar,
      };

      const user = await userService.create(newUSer);
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
      res.status(200).json({ success:true, message: "Signup successful", data: user, token });
    } catch (error) {
      res.status(500).json({message:"Error in Signup Controller", error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      // Handle login logic here
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      // Handle logout logic here
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

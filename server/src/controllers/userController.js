import User from "../../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exist");

      return res.status(400).json({ error: "User does not exist" });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password");

      return res.status(400).json({ error: "Invalid password" });
    }

    const { encyptedpassword, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Login successful.",
      success: true,
      user: userData,
      ok: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User Already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return res.status(201).json({
      message: "User is created Successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

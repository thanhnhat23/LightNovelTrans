import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const signup = async (req, res) => {
  const { email, userName, password } = req.body;
  try {
    // Validate user data
    if (!email || !userName || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create random 10 string salt for password
    const salt = await bcrypt.genSalt(10);
    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      userName,
      password: hashedPassword,
      nameTag
    });

    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      // Create data user
      res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error signing up controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate jwt token
    generateToken(user._id, res);
    // Send user data
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      nameTag: user.nameTag
    });
  } catch (error) {
    console.log("Error logging in controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successful" });
  } catch (error) {
    console.log("Error logging out controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (user.profilePicId) {
      // Xóa avatar cũ
      await cloudinary.uploader.destroy(user.profilePicId);
      console.log("Complete remove profile pic id: ", user.profilePicId);
    }

    // Crop image
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      transformation: [
        { width: 250, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "webp" },
      ],
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
        profilePicId: uploadResponse.public_id,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating profile controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBackground = async (req, res) => {
  try {
    const { profileBackground } = req.body;
    const userId = req.user._id;

    if (!profileBackground) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (user.profileBackgroundId) {
      // Xóa avatar cũ
      await cloudinary.uploader.destroy(user.profileBackgroundId);
      console.log("Complete remove profile pic id: ", user.profileBackgroundId);
    }

    // Crop image
    const uploadResponse = await cloudinary.uploader.upload(profileBackground, {
      transformation: [
        { width: 500, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "webp" },
      ],
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileBackground: uploadResponse.secure_url,
        profileBackgroundId: uploadResponse.public_id,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating profile background controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const {
      linkSocial_1,
      linkSocial_2,
      linkSocial_3,
      nameTag,
      nameSocial_1,
      nameSocial_2,
      nameSocial_3,
      bio,
    } = req.body;

    const userId = req.user._id;
    const world = bio ? bio.length : 0;
    if (world > 880) {
      return res
        .status(400)
        .json({ message: "Bio must be less than 880 characters" });
    }

    const existingUser = await User.findOne({ nameTag, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "nameTag is already taken!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        linkSocial_1,
        linkSocial_2,
        linkSocial_3,
        nameSocial_1,
        nameSocial_2,
        nameSocial_3,
        bio,
        nameTag,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating info controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error checking auth controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token and expiration date
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpires;
    await user.save();

    // Send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("Error forgot password controller: ", error);
    res.status(500).json({ message: "Server error: " });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error reset password controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

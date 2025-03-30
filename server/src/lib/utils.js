import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Block client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== "development", // Only use HTTPS on production
    sameSite: "strict", // Block cross-site requests forgery
    maxAge: 14 * 24 * 60 * 60 * 1000, // Expired in 3 days
  });

  return token;
};

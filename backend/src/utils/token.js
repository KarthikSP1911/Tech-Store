import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const accessTokenOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 15 * 60 * 1000,
};
//sameSite: strict

const refreshTokenOptions = {
  httpOnly: true,
  secure:true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res
      .cookie("accessToken", newAccessToken, accessTokenOptions)
      .status(200)
      .json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

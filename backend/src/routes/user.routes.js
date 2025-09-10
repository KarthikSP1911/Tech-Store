import express from "express";
import { generateTokens } from "../utils/token.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import authUser from "../middleware/auth.middleware.js";

const router = express.Router();

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
}

router.post("/register",async (req, res) => {
    //check if user exists
    //hashpassword
    //create user
    // generate tokens
    //set tokens
    // responese
try {
    
        const {name, email, password} = req.body;
    
        const userExists = await User.findOne({email});
    
        if(userExists) return res.status(400).json("user already exists");
    
        const user = await User.create({name, email, password});
        user.save();
        
        console.log(user);
        return res.status(201).json(
            {message:"user regstered in successfully"}
        )
} catch (error) {
    console.log(error);
    return res.status(202).json({message:error.message});
}


});
router.post("/login", asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");
   if (!user) return res.status(401).json({ message: "User not found" });

    const passValid = await user.comparePassword(password);
    
    if (!passValid) return res.status(401).json("Invalid credentials");
    

    const {accessToken, refreshToken} = generateTokens(user);

    res.cookie("accessToken",accessToken,{...options, maxAge: 15 * 60 * 1000});
    user.refresh_token = refreshToken;
    await user.save();
    res.cookie("refreshToken",refreshToken,{...options});

     const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refresh_token;
    console.log(safeUser);
    return res.status(201).json(
        {message:"logged in successfully",user: safeUser}
    )

}));

router.get("/cart", authUser, asyncHandler(async(req, res) => {
    
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({message:"no token provided"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);

        if(!user) return res.status(400).json({message:"user not found"});
        

        res.status(200).json({cart: user.cart});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
}));

router.post("/cart/update",authUser, async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const UpdatedCart = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { cart: UpdatedCart },
      { new: true }
    );
    console.log("cart updated");
    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Failed to update" });
  }
});

router.post("/logout",authUser,async (req, res) => {
    await User.findById(req.user,{
        $unset: {refreshToken : 1}},
        {new:true});
    
    const options = {
    httpOnly: true,
    secure: true
    }

    res.status(200).clearCookie("accessToken", options)
     .clearCookie("accessToken", options).json({message:"user logged out successfully"});

});


router.post("/refresh",authUser, async (req, res) => {
    const { refreshToken } = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token, please login again" });
    }

    try {
        // 1. Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // 2. Check if token exists in DB
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // 3. Issue a new access token
        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );


        // 4. Send new access token
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({ message: "Access token refreshed" });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Failed to refresh token" });
    }
});

export default router;
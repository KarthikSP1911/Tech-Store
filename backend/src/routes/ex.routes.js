// import { loginUser, registerUser } from "../controllers/ex.controller.js";
import express from "express";

const router = express.Router();


router.get("/",(req, res) =>{
    res.send({message:"server is running....."});
}); // ex/  link


//ejs render
router.get("/register", (req, res) => {
    res.render("register", { title: "Home Page" });
});

// router.post("/register", registerUser);

// Directly defines a single HTTP method for a path.
// router.get("/login",(req, res) =>{
//     res.status(200).json({message:"hi"});
// })

// router.route() creates a chainable route handler.
// router.route("/user")
//   .get(getUsers)
//   .post(createUser)
//   .put(updateUser);

// router.route("/logout").post(verifyJWT,  logoutUser)

export default router;
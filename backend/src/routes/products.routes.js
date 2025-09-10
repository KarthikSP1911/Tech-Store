import express from "express";
// import { loginUser, registerUser } from "../controllers/ex.controller.js";
import User from "../models/user.model.js"
import Product from "../models/product.model.js";
const router = express.Router();

const products = [
  {
    name: "Wireless Mouse",
    price: 25.99,
    description: "Ergonomic wireless mouse with USB receiver",
    image:" https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Electronics",
    stock: 100
  },
  {
    name: "Bluetooth Headphones",
    price: 59.99,
    description: "Noise-cancelling over-ear headphones",
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Electronics",
    stock: 75
  },
  {
    name: "Laptop Backpack",
    price: 45.00,
    description: "Water-resistant backpack with multiple compartments",
    image: "https://images.unsplash.com/photo-1622560481979-f5b0174242a0?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Accessories",
    stock: 50
  },
  {
    name: "Mechanical Keyboard",
    price: 70.49,
    description: "RGB backlit mechanical keyboard with blue switches",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",
    category: "Electronics",
    stock: 60
  }
];

router.get("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany(); // Remove old data
    const createdProducts = await Product.insertMany(products);
    res.status(201).json({
      message: `Seeded ${createdProducts.length} products successfully`,
      products: createdProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Error seeding products", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/create-user", (req, res) => {
    async function createTestUser() {
    const user = new User({
        name: "abc",
        email:"abc@gmail.com",
        password:"12345678"
    });

    const savedUser = await user.save();
    console.log("Test User ID:", savedUser._id);
}

    createTestUser();
    res.json("user created");
})

router.get("/cart", async (req, res) => {
    
    try {
        const user = await User.findById("688f97b0dfb07d68ae99d975");
        res.json({ cart: user.cart });
    } catch (error) {
        console.log(error.message);
    }

})

router.post("/cart/update", async(req, res) => {
    try {
        const userId = "688f97b0dfb07d68ae99d975";
        const UpdatedCart = req.body;

        const user = await User.findByIdAndUpdate(userId, {cart: UpdatedCart},{new: true});
        user.save();
        res.status(200).json({message:"cartupdated"});
    } catch (error) {
        console.log(error.message)
        res.status(400).json({message:"failed to update"});
    }
})



export default router;

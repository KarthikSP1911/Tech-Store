import React from 'react'
import { useEffect, useState } from 'react'
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import api from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const  Product = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProducts = async() =>{
            try {
                let res = await api.get("/api/products");
                setProducts(res.data);
            } catch (err) {
                console.log("error fetching products");
            }
        }

        const fetchCart = async () => {
        try {
            let res = await api.get("/api/user/cart", {withCredentials: true});
            if (!res.data.cart) {
            setCart({});
            } else {
            const cartObject = res.data.cart.reduce((acc, item) => {
                acc[item.productId] = item.quantity;
                return acc;
            }, {});
            setCart(cartObject);
            }
        } catch (err) {
            console.log("error from fetching cart from backend");
        }
        };
        fetchProducts();
        fetchCart();

        // console.log(products);
        // console.log(cart);
        // console.log(user);
    },[]);

    const handleAdd = (productId) =>{
        const updatedCart = {...cart, [productId] : ( cart[productId] || 0 ) + 1}
        setCart(updatedCart);
        const updatedCartArray = Object.entries(updatedCart).map(([productId, quantity]) => ({
        productId,
        quantity
        }));

        axios.post("/api/user/cart/update",updatedCartArray);
    }

    const handleDelete = (productId) =>{
        const updatedCart = {...cart};
        if(updatedCart[productId] <= 1){
            delete updatedCart[productId];
        }
        else{
            updatedCart[productId] -= 1;
        }
        setCart(updatedCart);
        const updatedCartArray = Object.entries(updatedCart).map(([productId, quantity]) => ({
  productId,
  quantity
}));

        axios.post("/api/user/cart/update", updatedCartArray);
    }

    const handleLogout = () => {
    
    localStorage.removeItem("user");

    navigate("/");
    };
        
  return (
    <div className='w-full min-h-screen bg-black'>
        <div className="flex justify-between items-center   p-5">
        
        <h1 className='text-5xl text-white font-bold font-mono'>Welcome <span className='text-blue-700 capitalize'>{user?.name}</span></h1>
          <div className='flex gap-5'>
              <Link to="/order">
                <button className="bg-black text-white px-3 py-1 rounded text-4xl hover:text-blue-700">
                    <FaShoppingCart />
                </button>
                </Link>
              {totalItems > 0 && (
                <span className="absolute top-4 right-32 font-bold bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
                      <button
              onClick={() =>{handleLogout()}}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-xl hover:bg-red-700"
                      >
              Logout
                      </button>
          </div>
      </div>
      
          <h1 className='text-white mx-10 p-2 border-b-4 border-white text-3xl'>Products</h1>
        <div className='grid md:grid-cols-3 lg:grid-cols-4   m-2 gap-5 rounded-lg'>
        {products.map((item) => {
            const quantity = cart[item._id] || 0;
            return (
                <div key={item._id} className='border border-2 flex flex-col items-center p-6 m-10 rounded-lg hover:scale-105 transition-all duration-200 hover:shadow-2xl bg-gray-800 hover:shadow-[0_6px_30px_rgba(0,0,139,0.8)] hover:outline-1 hover:outline-blue-400'>
                    <div className='  overflow-hidden'><img src={item.image} className='w-48 h-48 rounded-lg object-fill -translate-y-2 transtion-all duration-300 hover:scale-110 bg-blend-darken'/></div>
                    <p className='py-1 text-xl font-bold font-medium text-white'>{item.name}</p>
                    <p className='py-1 text-gray-300'> ₹ {item.price}</p>

                    { quantity == 0 ? (<motion.button  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.9 }} className='w-3/4 p-3    bg-green-400 rounded-lg' onClick={() => {handleAdd(item._id)}}> Add to Cart </motion.button> ):

                    (<div className='   flex  w-3/4 p-2  justify-center items-start gap-8 text-xl'>
                        <motion.button  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className='bg-green-400 text-white font-extrabold p-1 px-3 rounded-lg' onClick={() => {handleAdd(item._id)}}>+</motion.button>
                        <p className='text-white font-extrabold font-mono'>{cart[item._id]}</p>
                        <motion.button  whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }} className='bg-red-600 text-white font-extrabold p-1 px-3 rounded-lg' onClick={() => {handleDelete(item._id)}}>-</motion.button>
                    </div>)}
                </div>
        );
        })}
        </div>

      
    </div>
  )
}

export default  Product

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

const Order = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await axios.get("/api/products");
        const fetchedCart = await axios.get("/api/user/cart");

        const cartObject = fetchedCart.data.cart.reduce((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {});

        setProducts(fetchedProducts.data);
        setCart(cartObject);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (productId, quantity) => {
    const updatedCart = { ...cart, [productId]: quantity };
    if (quantity <= 0) delete updatedCart[productId];

    setCart(updatedCart);

    const updatedCartArray = Object.entries(updatedCart).map(([id, qty]) => ({
      productId: id,
      quantity: qty,
    }));

    axios.post("/api/user/cart/update", updatedCartArray);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      confetti({
      particleCount: 200,
      spread: 90,
      origin: { x:0.81, y: 0.5 }
    });
      setTimeout(async() => { await axios.post("/api/user/cart/update", []);

        setCart({});}, 3000)
        
        toast.success('Order placed sucessfully...', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          
        });
        setTimeout(() => {
          setLoading(false);
        navigate('/product');
        }, 5000);
    } catch (err) {
      console.log("error during checkout", err);
    }
    finally{
    }
  };

  const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = products.find((p) => p._id === id);
    return total + (product ? product.price * qty : 0);
  }, 0);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-black text-white p-8">
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        
        />
       <div className="flex justify-between items-center mb-10 pb-3 font-mono 
                  border-b-2 border-blue-700 
                  transition-all duration-500 hover:border-blue-400">
        <h1 className="text-5xl mx-19">Your Orders</h1>
        <button
        onClick={() => navigate("/product")}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-800 rounded-xl text-lg font-semibold 
                    shadow-md shadow-gray-900/40 transition-all duration-300"
        >
        <FaArrowLeft className="inline mr-2" /> Shop More
        </button>
    </div>
    
       

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* LEFT SIDE - Order Items */}
        <div className="flex-1 flex flex-col gap-6">
          {Object.keys(cart).length === 0 ? (
            <motion.div initial={{ opacity: 0, x:-50 }}
              animate={{ opacity: 1 , x: 0}}
              transition={{ duration: 0.8 }}
             className="flex flex-col items-start justify-center text-gray-400 mt-20 hover:text-white">
            <FaShoppingCart className="text-7xl mb-4 opacity-70" />
            <p className="text-4xl font-semibold">Your cart is empty</p>
            <p className="text-xl text-gray-500 mt-2">Add some products to get started</p>
          </motion.div>
          ) : (
            <AnimatePresence>
              {Object.entries(cart).map(([id, qty]) => {
                const product = products.find((p) => p._id === id);
                if (!product) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-gray-800/80 shadow-lg shadow-blue-900/50 hover:shadow-blue-700/70
                               rounded-xl p-5 flex items-center gap-6 transition-shadow duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col justify-center gap-3 flex-1">
                      <div className="text-2xl font-semibold">{product.name}</div>
                      <div className="text-lg text-gray-300">₹ {product.price}</div>
                      <div className="flex gap-6 mt-3">
                        <motion.button whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => handleUpdate(id, qty - 1)}
                          className="px-3 py-1 font-extrabold bg-red-600 hover:bg-red-700 rounded-lg text-xl font-bold shadow-md"
                        >
                          <MdDelete/>
                        </motion.button>
                        <p className="text-xl">{qty}</p>
                        <motion.button whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdate(id, qty + 1)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-bold shadow-md"
                        >
                          <FaPlusCircle/>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            }
            </AnimatePresence>
          )}
        </div>

        
        {Object.keys(cart).length > 0 && (
          
          <div className="lg:w-80 w-full bg-gray-900/90 p-6 rounded-xl shadow-md shadow-blue-900/40 h-fit sticky top-10 self-start">
            <h2 className="text-3xl mb-4 font-semibold">Order Summary</h2>
            <p className="text-lg mb-2">
              Total Items:{" "}
              <span className="text-blue-400">{totalItems}</span>
            </p>
            <p className="text-2xl mb-6 font-semibold">
              Total Price:{" "}
              <span className="text-blue-400">₹ {totalPrice}</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-2xl text-2xl font-bold font mono 
                          shadow-lg shadow-green-900/50 
                          ${loading 
                            ? 'bg-gray-400 cursor-not-allowed text-black' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'}`}
              onClick={handleSubmit}
            >
              {loading ? "Proceeding…" : "Checkout"}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;

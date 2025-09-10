import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[80px] shadow-md fixed top-0 left-0 bg-black z-30">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center px-10 h-full">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold tracking-wide hover:opacity-90 transition font-mono">
          <span className="text-blue-500 uppercase font-bold">Future </span>
          <span className="uppercase font-bold text-white">Tech</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 px-4 py-1 rounded-full shadow-sm bg-white text-bold">
          <Link to="/" className="relative group text-lg px-4 py-2 hover:text-blue-900 transition">
            Home
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/login" className="relative group text-lg px-4 py-2 hover:text-blue-600 transition">
            Login
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/register" className="relative group text-lg px-4 py-2 hover:text-blue-600 transition">
            Register
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden justify-between items-center px-5 h-full">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <span className="text-blue-500 uppercase font-bold">Future </span>
          <span className="uppercase font-bold text-white">Tech</span>
        </Link>
        <button
          className="z-30 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} className="text-white hover:text-black" /> : <Menu size={24} className="text-white hover:text-black" />}
        </button>
      </div>

      {/* Overlay background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 w-2/3 max-w-[300px] h-full bg-gray-900 text-white flex flex-col items-center justify-center gap-8 transform transition-transform duration-300 z-20 rounded-l-xl shadow-lg
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <Link to="/" onClick={() => setIsOpen(false)} className="text-lg hover:underline">Home</Link>
        <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg hover:underline">Login</Link>
        <Link to="/register" onClick={() => setIsOpen(false)} className="text-lg hover:underline">Register</Link>
      </div>
    </div>
  );
};

const TypeWriting = () => {
  return (
    <p className="text-3xl font-mono sm:text-4xl md:text-5xl absolute top-1/3 left-5 sm:left-10 font-extrabold text-white">
      Browse our latest
      <br />
      <span className="text-blue-600 font-semibold block mt-2">
        <Typewriter
          words={['Smartphones', 'Laptops', 'Headphones', 'Accessories']}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </span>
    </p>
  );
};

const Home = () => {
  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <Navbar />
      <div className="relative mt-[80px]">
        <img src="/banner.jpg" className="w-full h-[80vh] object-cover" alt="Banner" />
        <TypeWriting />
      </div>
    </div>
  );
};

export default Home;

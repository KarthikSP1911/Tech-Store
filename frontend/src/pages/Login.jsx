import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/user/login', data);
      const user = res.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      console.log("User saved:", user);
      reset();
      navigate('/product');
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 404) {
          toast.error('User not found');
        } else if (status === 401) {
          toast.error('Invalid credentials');
        } else {
          toast.error('Something went wrong');
        }
      } else {
        toast.error('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 px-4">
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
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl p-8 border border-transparent 
        hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] 
        transition-all duration-500 ease-out">
        <h2 className="text-3xl font-extrabold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="absolute bottom-6 right-6 bg-gradient-to-r bg-black opacity-80 text-white font-semibold px-6 py-3 rounded-full shadow-md 
                   border border-transparent hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/50 
                   transition-all duration-300 ease-in-out"
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default Login;

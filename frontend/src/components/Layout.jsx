import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartSidebar />
      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="flex-grow pt-20 pb-safe soft-appear"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}

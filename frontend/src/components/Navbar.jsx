import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/">
            <img
              src={logo}
              alt="The Burgery"
              className="h-10 lg:h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-semibold uppercase hover:text-primary transition-colors">Inicio</Link>
            <Link to="/menu" className="text-sm font-semibold uppercase hover:text-primary transition-colors">Menú</Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 md:p-2 lg:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-full tap-target">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 tap-target">
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg absolute w-full"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 h-12 flex items-center text-base font-medium border-b">Inicio</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block px-4 h-12 flex items-center text-base font-medium border-b">Menú</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

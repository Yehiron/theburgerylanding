import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { motion, useReducedMotion } from 'framer-motion';
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const isActive = (path) => location.pathname === path;

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
            <Link 
              to="/" 
              className={`text-sm font-semibold uppercase pb-1 border-b-2 transition-all duration-200 ${
                isActive('/') 
                  ? 'border-gray-500 text-black' 
                  : 'border-transparent text-gray-700 hover:text-black hover:border-gray-300'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/menu" 
              className={`text-sm font-semibold uppercase pb-1 border-b-2 transition-all duration-200 ${
                isActive('/menu') 
                  ? 'border-gray-500 text-black' 
                  : 'border-transparent text-gray-700 hover:text-black hover:border-gray-300'
              }`}
            >
              Menú
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 md:p-2 lg:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={shouldReduceMotion ? { duration: 0.01 } : undefined}
                  className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="relative p-3 rounded-full tap-target">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
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

      {/* Mobile Menu: rendered in a portal so its backdrop can cover the full
          viewport — the navbar's `glass` backdrop-blur makes it a containing
          block for `fixed` descendants, which would otherwise trap the
          backdrop inside the navbar's own height. */}
      {isMenuOpen && createPortal(
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0.01 } : undefined}
            className="md:hidden bg-white shadow-lg fixed top-20 inset-x-0 z-50"
          >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 h-12 flex items-center text-base font-medium border-b transition-all ${
                isActive('/')
                  ? 'text-black font-bold border-gray-400 bg-gray-50'
                  : 'text-gray-600 border-gray-100 hover:text-black'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 h-12 flex items-center text-base font-medium border-b transition-all ${
                isActive('/menu')
                  ? 'text-black font-bold border-gray-400 bg-gray-50'
                  : 'text-gray-600 border-gray-100 hover:text-black'
              }`}
            >
              Menú
            </Link>
          </div>
          </motion.div>
        </>,
        document.body
      )}
    </nav>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiPlus, FiSearch } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || "";
const money = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productNotes, setProductNotes] = useState('');
  const notesInputRef = useRef(null);
  const { addToCart } = useCart();

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setProductNotes('');
  };

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, productNotes);
      setSelectedProduct(null);
      setProductNotes('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products`)
        ]);
        setCategories(catsRes.data);
        setProducts(prodsRes.data);
        if (catsRes.data.length > 0) {
          setActiveCategory('all');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const focusNotes = window.requestAnimationFrame(() => {
      notesInputRef.current?.focus({ preventScroll: true });
      notesInputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(focusNotes);
  }, [selectedProduct]);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category_id === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch && p.is_available;
  });

  return (
    <div className="bg-light min-h-screen pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bebas text-dark tracking-widest mb-4">NUESTRO <span className="text-black">MENÚ</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Más que burgers. Sabores creados para compartir, disfrutar y volver.</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-none shadow-sm focus:ring-2 focus:ring-black outline-none"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all ${activeCategory === 'all' ? 'bg-dark text-white' : 'bg-white text-dark hover:bg-gray-100'}`}
            >
              Todos
            </button>
            {categories.map(cat => {
              const isBurgerMaster = cat.name.toLowerCase() === 'burgermaster';
              if (isBurgerMaster) {
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2 rounded-full whitespace-nowrap text-base font-bold transition-all duration-300 transform shimmer-effect active:scale-95 ${
                      isActive 
                        ? 'burgermaster-btn-active shadow-[0_0_15px_rgba(201,162,39,0.5)] hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(201,162,39,0.65)]' 
                        : 'burgermaster-btn-inactive hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(201,162,39,0.4)]'
                    }`}
                    style={{
                      animation: 'burgermaster-pulse 5.5s infinite ease-in-out'
                    }}
                  >
                    {cat.name}
                  </button>
                );
              }
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all ${activeCategory === cat.id ? 'bg-dark text-white' : 'bg-white text-dark hover:bg-gray-100'}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No se encontraron productos.
                </div>
              ) : (
                filteredProducts.map(product => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col"
                  >
                    <div className="h-[20.5rem] overflow-hidden relative bg-gray-100">
                      {product.image_url ? (
                        <img 
                          src={`${API_URL}${product.image_url}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bebas text-xl">THE BURGERY</div>
                      )}
                      {product.is_featured && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          Destacado
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-dark">{product.name}</h3>
                        <span className="text-xl font-bebas text-gray-500">${money.format(product.price)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{product.description}</p>
                      
                      <button 
                        onClick={() => handleAddToCartClick(product)}
                        className="w-full py-4 md:py-3 min-h-[48px] bg-light hover:bg-dark hover:text-white text-dark font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <FiPlus /> Agregar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal de Observaciones */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedProduct(null)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto relative z-10 shadow-2xl my-auto"
            >
              <h3 className="text-3xl font-bebas text-dark mb-2">Añadir al Carrito</h3>
              <p className="text-gray-500 mb-6">¿Deseas agregar alguna observación para <strong>{selectedProduct.name}</strong>?</p>
              
              <textarea 
                ref={notesInputRef}
                className="w-full p-4 border rounded-xl text-base md:text-sm focus:ring-black focus:border-black outline-none mb-6"
                rows="3"
                placeholder="Ej. Sin cebolla, extra salsa..."
                value={productNotes}
                onChange={(e) => setProductNotes(e.target.value)}
              ></textarea>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 bg-gray-100 text-dark font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmAddToCart}
                  className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

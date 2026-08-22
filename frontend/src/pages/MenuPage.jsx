import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiSearch } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || "";
const money = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

const getDisplayPrice = (product) => {
  if (product.options?.length > 0) {
    return Math.min(...product.options.map((o) => o.price));
  }
  return product.price;
};

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productNotes, setProductNotes] = useState('');
  const [optionQuantities, setOptionQuantities] = useState({});
  const { addToCart } = useCart();

  const hasOptions = selectedProduct?.options?.length > 0;
  const totalOptionQuantity = Object.values(optionQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalOptionPrice = hasOptions
    ? selectedProduct.options.reduce((sum, o) => sum + (optionQuantities[o.id] || 0) * o.price, 0)
    : 0;

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setProductNotes('');
    setOptionQuantities({});
  };

  const changeOptionQuantity = (optionId, delta) => {
    setOptionQuantities((prev) => {
      const next = Math.max(0, (prev[optionId] || 0) + delta);
      return { ...prev, [optionId]: next };
    });
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    if (hasOptions) {
      selectedProduct.options.forEach((option) => {
        const qty = optionQuantities[option.id] || 0;
        if (qty > 0) addToCart(selectedProduct, '', option, qty);
      });
    } else {
      addToCart(selectedProduct, productNotes);
    }
    setSelectedProduct(null);
    setProductNotes('');
    setOptionQuantities({});
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
          setActiveCategory(catsRes.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // Sin categoría "Todos", una búsqueda activa se aplica a todo el menú
    // en vez de quedar limitada a la categoría seleccionada.
    const matchCategory = searchTerm.trim() !== '' || p.category_id === activeCategory;
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
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pt-2 pb-3 px-1 scrollbar-hide">
            {categories.map(cat => {
              if (cat.is_highlighted) {
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 transform shimmer-effect active:scale-95 w-auto min-w-max ${
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
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No se encontraron productos.
                </div>
              ) : (
                filteredProducts.map(product => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                        <span className="text-xl font-bebas text-gray-500">
                          {product.options?.length > 0 && <span className="text-xs align-top mr-1">Desde</span>}
                          ${money.format(getDisplayPrice(product))}
                        </span>
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
          </div>
        )}
      </div>

      {/* Modal de Observaciones: en un portal porque el <main> (animado con
          framer-motion) queda con un transform activo, lo que lo vuelve
          "containing block" de los elementos fixed y rompe este overlay.
          Sin AnimatePresence/exit: en esta versión de framer-motion, la
          animación de salida a veces termina pero nunca dispara el
          desmontaje real (el elemento queda invisible pero interceptando
          clics) — se confirmó también en el build de producción. Se deja
          solo la animación de entrada, que sí funciona de forma confiable. */}
      {createPortal(
          selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedProduct(null)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto relative z-10 shadow-2xl my-auto"
            >
              <h3 className="text-3xl font-bebas text-dark mb-2">Añadir al Carrito</h3>

              {hasOptions ? (
                <div className="mb-6">
                  <p className="text-gray-500 mb-3">Elige cuántas quieres de cada sabor de <strong>{selectedProduct.name}</strong>:</p>
                  <div className="space-y-2">
                    {selectedProduct.options.map((option) => {
                      const qty = optionQuantities[option.id] || 0;
                      return (
                        <div key={option.id} className={`flex items-center justify-between gap-3 p-3 border rounded-xl transition-colors ${qty > 0 ? 'border-black bg-gray-50' : ''}`}>
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-500">${money.format(option.price)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => changeOptionQuantity(option.id, -1)}
                              disabled={qty === 0}
                              className="w-9 h-9 tap-target rounded-full border flex items-center justify-center disabled:opacity-30 hover:bg-gray-100"
                              aria-label={`Quitar ${option.name}`}
                            >
                              <FiMinus />
                            </button>
                            <span className="w-6 text-center font-bold">{qty}</span>
                            <button
                              type="button"
                              onClick={() => changeOptionQuantity(option.id, 1)}
                              className="w-9 h-9 tap-target rounded-full border flex items-center justify-center hover:bg-gray-100"
                              aria-label={`Agregar ${option.name}`}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 mb-6">¿Deseas agregar alguna observación para <strong>{selectedProduct.name}</strong>?</p>
                  <textarea
                    className="w-full p-4 border rounded-xl text-base md:text-sm focus:ring-black focus:border-black outline-none mb-6"
                    rows="3"
                    placeholder="Ej. Sin cebolla, sin lechuga..."
                    value={productNotes}
                    onChange={(e) => setProductNotes(e.target.value)}
                  ></textarea>
                </>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 bg-gray-100 text-dark font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAddToCart}
                  disabled={hasOptions && totalOptionQuantity === 0}
                  className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:hover:bg-black"
                >
                  {hasOptions
                    ? (totalOptionQuantity > 0 ? `Agregar ${totalOptionQuantity} · $${money.format(totalOptionPrice)}` : 'Elige al menos 1')
                    : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
          ),
        document.body
      )}
    </div>
  );
}

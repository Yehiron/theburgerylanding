import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "";

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const PHONE_NUMBER = "573248450908"; // Código país Colombia temporal

  const handleSendOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Por favor, completa tus datos de envío antes de continuar.");
      return;
    }
    
    const lines = [
      "🍔 *Hola The Burgery* 🍔",
      "Quiero realizar el siguiente pedido:",
      "",
      "👤 *Datos del Cliente:*",
      `• Nombre: ${customerName}`,
      `• Teléfono: ${customerPhone}`,
      `• Dirección: ${customerAddress}`,
      "",
      "🛒 *Pedido:*"
    ];
    
    cart.forEach(item => {
      lines.push(`• ${item.quantity}x ${item.name} ($${item.price * item.quantity})`);
      if (item.notes && item.notes.trim() !== "") {
        lines.push(`   ↳ 📝 *Nota:* ${item.notes.trim()}`);
      }
    });
    
    lines.push("");
    lines.push(`💰 *Total:* $${cartTotal}`);
    
    const message = lines.join('\n');
    const url = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.5 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bebas text-dark">Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 tap-target hover:bg-gray-200 rounded-full">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                cart.map(item => {
                  const uniqueId = item.cartItemId || item.id;
                  return (
                  <div key={uniqueId} className="flex gap-4 items-center border-b pb-4">
                    {item.image_url ? (
                       <img src={`${API_URL}${item.image_url}`} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                       <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs">Sin img</div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      {item.notes && <p className="text-xs text-gray-500 italic mt-1">{item.notes}</p>}
                      <p className="text-gray-500 font-semibold mt-1">${item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(uniqueId, -1)} className="p-2 bg-gray-100 rounded tap-target"><FiMinus size={16}/></button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(uniqueId, 1)} className="p-2 bg-gray-100 rounded tap-target"><FiPlus size={16}/></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(uniqueId)} className="text-gray-500 p-3 hover:bg-gray-50 rounded tap-target">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                )})
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border rounded-lg text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. Juan Pérez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Celular *</label>
                    <input 
                      type="tel" 
                      className="w-full p-3 border rounded-lg text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. 3001234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Dirección de entrega *</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border rounded-lg text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. Calle 123 #45-67 Apto 101"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bebas text-black">${cartTotal}</span>
                </div>
                <button 
                  onClick={handleSendOrder}
                  className="w-full py-4 bg-gray-500 text-white font-bold rounded-xl hover:bg-opacity-90 transition-all flex justify-center items-center gap-2 uppercase tracking-wide"
                >
                  Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

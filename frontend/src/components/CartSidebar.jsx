import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "";
const money = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export default function CartSidebar() {
  const { cart, cartCount, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const PHONE_NUMBER = "573248450908"; // Código país Colombia temporal

  const handleSendOrder = () => {
    if (!customerName || !customerPhone || (deliveryMethod === 'delivery' && !customerAddress)) {
      alert(deliveryMethod === 'delivery' ? "Por favor, completa tus datos y la dirección de entrega antes de continuar." : "Por favor, completa tus datos antes de continuar.");
      return;
    }
    
    const lines = [
      "🍔 *Hola The Burgery* 🍔",
      "Quiero realizar el siguiente pedido:",
      "",
      "👤 *Datos del Cliente:*",
      `• Nombre: ${customerName}`,
      `• Teléfono: ${customerPhone}`,
      `• Modalidad: ${deliveryMethod === 'pickup' ? 'Recoger en tienda' : 'Domicilio'}`,
      ...(deliveryMethod === 'delivery' ? [`• Dirección: ${customerAddress}`, '• Envío: se confirma según la dirección.'] : []),
      "",
      "🛒 *Pedido:*"
    ];
    
    cart.forEach(item => {
      lines.push(`• ${item.quantity}x ${item.name} ($${money.format(item.price * item.quantity)})`);
      if (item.notes && item.notes.trim() !== "") {
        lines.push(`   ↳ 📝 *Nota:* ${item.notes.trim()}`);
      }
    });
    
    lines.push("");
    lines.push(`💰 *Subtotal:* $${money.format(cartTotal)}`);
    lines.push(deliveryMethod === 'delivery' ? '🚚 *Total final:* subtotal + valor de envío según la dirección.' : `💰 *Total:* $${money.format(cartTotal)}`);
    
    const message = lines.join('\n');
    const url = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    clearCart();
    setIsCartOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setDeliveryMethod('delivery');
  };

  return (
    <>
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed right-4 bottom-5 sm:right-6 sm:bottom-6 z-40 rounded-full bg-black px-5 py-4 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
          >
            <FiShoppingCart size={20} />
            Ir al carrito
            <span className="min-w-6 h-6 px-1 rounded-full bg-primary inline-flex items-center justify-center text-xs">{cartCount}</span>
          </motion.button>
        )}
      </AnimatePresence>

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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bebas text-dark">Tu Carrito</h2>
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</span>
              </div>
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
                      <p className="text-gray-500 font-semibold mt-1">${money.format(item.price)}</p>
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
                    <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase">¿Cómo quieres recibir tu pedido?</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`rounded-lg border px-3 py-3 text-sm font-bold transition-colors ${deliveryMethod === 'delivery' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700'}`}>Domicilio</button>
                      <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`rounded-lg border px-3 py-3 text-sm font-bold transition-colors ${deliveryMethod === 'pickup' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700'}`}>Recoger en tienda</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border rounded-lg text-base md:text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. Juan Pérez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Celular *</label>
                    <input 
                      type="tel" 
                      className="w-full p-3 border rounded-lg text-base md:text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. 3001234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  {deliveryMethod === 'delivery' && <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Dirección de entrega *</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border rounded-lg text-base md:text-sm focus:ring-black focus:border-black outline-none" 
                      placeholder="Ej. Calle 123 #45-67 Apto 101"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">{deliveryMethod === 'delivery' ? 'Subtotal' : 'Total'}</span>
                  <span className="text-3xl font-bebas text-black">${money.format(cartTotal)}</span>
                </div>
                {deliveryMethod === 'delivery' && <p className="mb-4 rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-600">El valor total del pedido se calcula sumando el envío, el cual depende de la dirección de entrega.</p>}
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
    </>
  );
}

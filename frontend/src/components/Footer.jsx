import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiInstagram, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { motion, useReducedMotion } from 'framer-motion';
import logoblanco from "../assets/images/logoblanco.png";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.8, ease: "easeOut", staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.01 : 0.5, ease: "easeOut" } }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="bg-[#0B0B0B] text-white pt-20 pb-16 border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-16">
          
          {/* Col 1: Logo & Description */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <Link to="/" className="inline-block transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={logoblanco}
                alt="The Burgery Logo"
                className="h-20 sm:h-24 w-auto object-contain brightness-105"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Burgers premium preparadas con ingredientes de la más alta calidad y un pan brioche horneado a diario. creamos experiencias memorables.
            </p>
            <p className="text-gray-500 font-bebas tracking-widest text-xs uppercase pt-2">
              EAT · SMILE · REPEAT
            </p>
          </motion.div>
          
          {/* Col 2: Navigation Links */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h3 className="text-lg font-bebas tracking-widest text-gray-300 border-b border-white/10 pb-2 w-full md:w-3/4 max-md:text-center">Navegación</h3>
            <ul className="space-y-4 w-full">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 block py-1 md:py-0">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 block py-1 md:py-0">
                  Menú
                </Link>
              </li>
              <li>
                <a href="https://wa.me/573008641475" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 block py-1 md:py-0">
                  Eventos y Catering
                </a>
              </li>
              <li>
                <a href="https://wa.me/573008641475" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 block py-1 md:py-0">
                  Contacto
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Col 3: Social Media & Contact */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h3 className="text-lg font-bebas tracking-widest text-gray-300 border-b border-white/10 pb-2 w-full md:w-3/4 max-md:text-center">Contacto y Redes</h3>
            
            <div className="space-y-4 w-full">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Calle+22+Norte+14-11,+Armenia,+Quindio,+Colombia" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center md:justify-start gap-3 group text-gray-400 hover:text-white text-sm transition-colors duration-300 py-1"
              >
                <FiMapPin className="text-gray-500 group-hover:text-white transition-colors shrink-0" size={18} />
                <span>Calle 22 Norte #14-11, Armenia, Colombia</span>
              </a>
              
              <a 
                href="https://wa.me/573008641475"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center md:justify-start gap-3 group text-gray-400 hover:text-white text-sm transition-colors duration-300 py-1"
              >
                <FiPhone className="text-gray-500 group-hover:text-white transition-colors shrink-0" size={18} />
                <span>+57 300 864 1475</span>
              </a>
              
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400 text-sm py-1">
                <FiClock className="text-gray-500 shrink-0" size={18} />
                <span>Dom a Jue 12-3 PM, 5-9 PM • Vie y Sáb 12-3 PM, 5-11 PM</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center md:justify-start">
              <motion.a 
                href="https://www.instagram.com/theburgery_/?hl=es" 
                target="_blank" 
                rel="noreferrer"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-all duration-300 text-sm font-semibold tracking-wide"
              >
                <FiInstagram size={18} />
                <span>@theburgery_</span>
              </motion.a>
            </div>
          </motion.div>
          
        </div>
        
        {/* Divider Line */}
        <div className="border-t border-white/10 w-full mb-10" />
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyrights */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} The Burgery • Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-[10px] tracking-wide">
              Crafted with by Yehiron Bermúdez.
            </p>
          </div>
          
          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1, borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-[#0F0F0F] text-gray-400 hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
            aria-label="Volver arriba"
          >
            <FiArrowUp size={20} />
          </motion.button>
          
        </div>
        
      </div>
    </motion.footer>
  );
}

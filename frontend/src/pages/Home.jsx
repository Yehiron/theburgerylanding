import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock } from 'react-icons/fi';
import fondo from "../assets/images/fondo.webp";
import minisliders from "../assets/images/minisliders.webp";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center px-4">
        {/* Usamos un color oscuro en caso de que no haya imagen real cargada, pero la idea es un fondo inmersivo */}
        <div className="absolute inset-0 bg-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10"></div>
          {/* Aquí iría la imagen gigante. Como no podemos descargar una, ponemos un patrón o gradiente premium */}
          <div
            className="w-full h-full bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${fondo})` }}
          ></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bebas text-white tracking-widest mb-6 drop-shadow-2xl leading-tight">
            THE BURGERY <br />EN CASA
          </h1>
          <p className="text-base md:text-lg text-gray-100 font-light mb-6 max-w-2xl mx-auto">
           <strong>Pedidos para recoger y domicilios</strong> 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="w-full sm:w-auto px-8 py-4 md:py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-dark transition-all transform hover:scale-105 uppercase tracking-widest text-sm">
              VER MENU
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Filosofía Section */}
      <section className="py-32 bg-white text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-sm font-semibold tracking-[0.3em] text-black mb-4 uppercase">Nuestra Filosofía</h2>
            <h3 className="text-4xl md:text-5xl font-bebas mb-8">NO HACEMOS COMIDA RÁPIDA. HACEMOS BUENA COMIDA LO MÁS RÁPIDO POSIBLE.</h3>
            <p className="text-gray-600 leading-relaxed text-lg mb-12">
              Creemos que cada mordisco debe ser una experiencia inolvidable. Por eso, seleccionamos cortes de carne premium cada mañana, horneamos nuestro propio pan brioche y preparamos nuestras salsas desde cero. No hay atajos para la perfección.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catering Section */}
      <section className="py-32 bg-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src={minisliders}
                  alt="Mini Sliders The Burgery"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-semibold tracking-[0.3em] text-black mb-4 uppercase">Servicio Exclusivo</h2>
              <h3 className="text-4xl md:text-5xl font-bebas mb-6">THE BURGERY CATERING</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Lleva la experiencia premium de The Burgery a tu próximo evento. Ya sea una reunión corporativa, un cumpleaños o una celebración especial, nosotros nos encargamos de que tus invitados disfruten de las mejores hamburguesas de la ciudad, preparadas al instante.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Menú personalizado</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Personal especializado</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Montaje premium</span>
                </li>
              </ul>
              <a href="https://wa.me/573248450908" target="_blank" rel="noreferrer" className="inline-block px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-black transition-all uppercase tracking-widest text-sm">
                Cotizar Evento
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-sm font-semibold tracking-[0.3em] text-black mb-4 uppercase">Encuéntranos</h2>
            <h3 className="text-4xl md:text-5xl font-bebas mb-16">VISITA THE BURGERY</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-dark bg-gray-50 !border-gray-200 text-dark p-8 rounded-3xl shadow-lg border flex flex-col justify-center items-center text-center">
                <FiMapPin className="text-black mb-4" size={40} />
                <h4 className="text-2xl font-bebas mb-2">Dirección</h4>
                <p className="text-gray-600">
                  Calle 22 Norte # 14-11
                  <br />
                  Barrio Laureles
                  <br />
                  Armenia, Quindio, Colombia
                </p>
              </div>
              <div className="glass-dark bg-gray-50 !border-gray-200 text-dark p-8 rounded-3xl shadow-lg border">
                <FiClock className="text-black mx-auto mb-4" size={40} />
                <h4 className="text-2xl font-bebas mb-2">Horario</h4>
                <p className="text-gray-600">
                  <strong>Domingo a Jueves</strong><br />
                  12:00 PM - 3:00 PM<br />
                  5:00 PM - 9:00 PM
                  <br /><br />
                  <strong>Viernes y Sábado</strong><br />
                  12:00 PM - 3:00 PM<br />
                  5:00 PM - 11:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

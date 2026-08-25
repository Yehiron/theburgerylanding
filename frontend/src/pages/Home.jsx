import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiAward, FiCoffee, FiStar } from 'react-icons/fi';
import fondo from "../assets/images/fondo.webp";
import minisliders from "../assets/images/minisliders.webp";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const cateringRef = useRef(null);
  const { scrollYProgress: cateringScrollProgress } = useScroll({
    target: cateringRef,
    offset: ["start end", "end start"]
  });
  const cateringImageY = useTransform(cateringScrollProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-18, 18]);
  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 32 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.01 : 0.6, ease: "easeOut" } }
  };
  const heroContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.13, delayChildren: shouldReduceMotion ? 0 : 0.15 } }
  };
  const heroItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: shouldReduceMotion ? "none" : "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: shouldReduceMotion ? 0.01 : 0.7, ease: "easeOut" } }
  };
  const premiumItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22, filter: shouldReduceMotion ? "none" : "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: shouldReduceMotion ? 0.01 : 0.62, ease: "easeOut" } }
  };
  const cateringContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } }
  };
  const locationItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.01 : 0.7, ease: "easeOut" } }
  };
  const locationImage = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: shouldReduceMotion ? 0.01 : 0.6, ease: "easeOut" } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center px-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-dark">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/60 to-black/90" />
          <motion.div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${fondo})` }}
            initial={{ scale: shouldReduceMotion ? 1 : 1.08 }}
            animate={{ scale: shouldReduceMotion ? 1 : 1.16 }}
            transition={{ duration: shouldReduceMotion ? 0 : 14, ease: "linear" }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="relative z-20 mx-auto max-w-3xl px-4"
        >
          <motion.div variants={heroItem} className="mb-7 flex justify-center">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.28em] text-white/85 backdrop-blur-sm">
              EAT · SMILE · REPEAT
            </span>
          </motion.div>
          <motion.h1
            variants={heroItem}
            className="mb-7 bg-gradient-to-b from-white to-gray-300 bg-clip-text font-bebas text-5xl leading-[0.95] tracking-[0.1em] text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:text-7xl md:text-8xl"
          >
            THE BURGERY
            <br />
            EN CASA
          </motion.h1>
          <motion.p variants={heroItem} className="mx-auto mb-10 max-w-md text-base font-light leading-relaxed text-white/80 md:text-lg">
            ¿Se te antojó? Pide ahora y disfruta donde quieras. Domicilio o para recoger, tú eliges.
          </motion.p>
          <motion.div variants={heroItem}>
            <Link
              to="/menu"
              className="inline-block border-b-2 border-white/40 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:border-white active:opacity-70"
            >
              Ver el menú →
            </Link>
          </motion.div>
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
            <h3 className="text-4xl md:text-5xl font-bebas mb-8">HAY DÍAS PARA CELEBRAR, DÍAS PARA DESCONECTARSE Y DÍAS EN LOS QUE SIMPLEMENTE QUIERES DARTE UN GUSTO.</h3>
            <p className="text-gray-600 leading-relaxed text-lg mb-12">
              Sea cual sea el motivo, queremos que encuentres en The Burgery un lugar donde la atención, el ambiente y sobre todo el sabor, hagan que cada visita se convierta en un momento especial, donde solo querrás repetir o probar algo nuevo en tu siguiente visita.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catering Section */}
      <section ref={cateringRef} className="relative isolate overflow-hidden bg-[#101010] py-24 text-white md:py-32">
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full bg-cover bg-center opacity-75 md:w-[58%]"
          style={{ backgroundImage: `url(${minisliders})`, y: cateringImageY, scale: 1.06 }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#101010]/15 via-[#101010]/70 to-[#101010] md:bg-gradient-to-r md:from-[#101010]/10 md:via-[#101010]/55 md:to-[#101010]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_43%,rgba(255,255,255,0.09),transparent_33%),radial-gradient(ellipse_at_76%_40%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.45px,transparent_0.5px)] [background-size:5px_5px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div aria-hidden="true" className="h-64 sm:h-72 md:h-auto" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={cateringContainer} className="max-w-xl text-center md:justify-self-end md:text-left">
              <motion.div variants={premiumItem} className="mb-6 flex -translate-y-[2.5cm] justify-center gap-3 text-white/65 max-md:translate-y-0 md:justify-start">
                <span className="h-px w-8 bg-white/35" />
                <FiStar size={11} fill="currentColor" aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase">Servicio exclusivo</span>
                <span className="h-px w-8 bg-white/35" />
              </motion.div>
              <motion.h3 variants={premiumItem} className="mb-7 -translate-y-[2.5cm] bg-gradient-to-b from-white to-gray-300 bg-clip-text text-5xl font-bebas leading-[0.9] tracking-[0.08em] text-transparent drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:text-6xl max-md:translate-y-0 md:text-7xl">
                THE BURGERY <br />EN TU EVENTO
              </motion.h3>
              <motion.p variants={premiumItem} className="mb-10 -translate-y-[1cm] max-w-lg text-base leading-relaxed text-gray-300 max-md:translate-y-0 md:text-lg">
                <strong>Haz que tu evento tenga un momento del que todos hablen.</strong>  Cocinamos nuestras burgers en el lugar para que cada invitado disfrute una experiencia recién hecha. Las fechas disponibles son limitadas, así que reserva con anticipación.
              </motion.p>
              <motion.div variants={premiumItem} className="mb-10 grid -translate-y-[1cm] grid-cols-3 gap-3 max-md:translate-y-0 sm:gap-5">
                {[
                  { icon: FiCoffee, label: 'Menú a tu medida' },
                  { icon: FiStar, label: 'Equipo experto' },
                  { icon: FiAward, label: 'Montaje premium' }
                ].map(({ icon: Icon, label }) => (
                  <motion.div key={label} whileHover={shouldReduceMotion ? undefined : { y: -3 }} transition={{ duration: 0.25 }} className="flex flex-col items-center border-t border-white/15 pt-4 text-center">
                    <Icon size={18} className="mb-3 text-white/75" aria-hidden="true" />
                    <p className="text-xs font-medium leading-snug text-gray-300 sm:text-sm">{label}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={premiumItem} className="flex justify-center md:justify-start">
                <a
                  href="https://wa.me/573008641475"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border-b-2 border-white/40 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:border-white active:opacity-70"
                >
                  Quiero cotizar mi evento →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-[#fafafa] py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mb-14 text-center md:mb-16"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-black">Encuéntranos</h2>
            <h3 className="font-bebas text-4xl md:text-5xl">VISITA THE BURGERY</h3>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={locationImage}
              className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-gray-200 shadow-lg"
            >
              <iframe
                title="Ubicación The Burgery en el mapa"
                src="https://www.google.com/maps?q=4.5597864,-75.6552734&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
              <a
                href="https://maps.app.goo.gl/LGfY9ks8sxHR3Fah9"
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 top-3 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-dark shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-white"
              >
                Abrir en Maps ↗
              </a>
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-2xl bg-white/30 px-4 py-3 text-center shadow-md backdrop-blur-sm">
                <p className="text-sm font-bold text-dark">Calle 22 Norte #14-11</p>
                <p className="text-xs text-gray-500">Barrio Laureles, Armenia</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cateringContainer}
              className="text-center md:text-left"
            >
              <motion.p variants={locationItem} className="mx-auto mb-8 max-w-md text-base leading-relaxed text-gray-600 md:mx-0 md:text-lg">
                Aquí se preparan burgers con amor. Ven, visítanos y disfruta la experiencia The Burgery.
              </motion.p>

              <motion.div variants={locationItem} className="mb-6 flex items-start justify-center gap-3 md:justify-start">
                <FiMapPin className="mt-1 shrink-0 text-gray-500" size={18} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-900">Calle 22 Norte #14-11, Barrio Laureles</p>
                  <p className="text-sm text-gray-500">Armenia, Quindío, Colombia</p>
                </div>
              </motion.div>

              <motion.div variants={locationItem} className="mb-9 flex items-start justify-center gap-3 md:justify-start">
                <FiClock className="mt-1 shrink-0 text-gray-500" size={18} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-900">Dom a Jue: 12-3 PM y 5-9 PM</p>
                  <p className="text-sm text-gray-500">Vie y Sáb: 12-3 PM y 5-11 PM</p>
                </div>
              </motion.div>

              <motion.div variants={locationItem} className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:gap-8 md:justify-start">
                <a
                  href="https://maps.app.goo.gl/LGfY9ks8sxHR3Fah9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border-b-2 border-black/30 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-dark transition-colors duration-200 hover:border-black active:opacity-70"
                >
                  Ver en Google Maps →
                </a>
                <a
                  href="https://wa.me/573008641475"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border-b-2 border-black/30 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-dark transition-colors duration-200 hover:border-black active:opacity-70"
                >
                  Contáctanos →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

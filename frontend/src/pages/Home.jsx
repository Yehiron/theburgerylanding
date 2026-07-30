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
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: shouldReduceMotion ? 0 : 0.1 } }
  };
  const heroItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.985 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: shouldReduceMotion ? 0.01 : 0.62, ease: "easeOut" } }
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

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center px-4">
        {/* Usamos un color oscuro en caso de que no haya imagen real cargada, pero la idea es un fondo inmersivo */}
        <div className="absolute inset-0 bg-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10"></div>
          {/* Aquí iría la imagen gigante. Como no podemos descargar una, ponemos un patrón o gradiente premium */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${fondo})` }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_62%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="relative z-20 mx-auto max-w-4xl px-4 text-center"
        >
          <motion.div variants={heroItem} className="mb-6 flex justify-center sm:mb-7">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-white/85 backdrop-blur-sm sm:px-4 sm:text-xs">
              EAT · SMILE · REPEAT
            </span>
          </motion.div>
          <motion.h1 variants={heroItem} className="mb-7 bg-gradient-to-b from-white to-gray-200 bg-clip-text text-4xl font-bebas leading-[0.95] tracking-[0.11em] text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.22)] sm:text-5xl sm:tracking-[0.14em] md:mb-8 md:text-6xl lg:text-8xl">
            THE BURGERY <br />EN CASA
          </motion.h1>
          <motion.p variants={heroItem} className="mx-auto mb-9 max-w-md text-base font-light leading-relaxed text-gray-100/85 md:mb-10 md:text-lg">
           <strong> <br /> ¿Se te antojó? <strong>Píde ahora</strong>  y disfrúta donde quieras. Domicilio o para recoger, tú eliges. Nosotros nos encargamos del resto</strong>
          </motion.p>
          <motion.div variants={heroItem} className="flex flex-col justify-center gap-4 sm:flex-row" whileHover={shouldReduceMotion ? undefined : { y: -2 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            <Link to="/menu" className="w-full rounded-full border-2 border-white bg-transparent px-8 py-4 text-sm font-bold tracking-widest text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-dark hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)] sm:w-auto md:py-4">
              VER MENU
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
                <motion.a href="https://wa.me/573248450908" target="_blank" rel="noreferrer" className="inline-block rounded-full border border-white/60 bg-black/20 px-8 py-4 text-sm font-bold tracking-widest text-white shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white hover:bg-white hover:text-dark hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]" whileHover={shouldReduceMotion ? undefined : { y: -2 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.3 }}>
                  QUIERO COTIZAR MI EVENTO
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="relative overflow-hidden bg-[#fafafa] py-28 md:py-32">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(0,0,0,0.035),transparent_20%),radial-gradient(circle_at_82%_72%,rgba(0,0,0,0.025),transparent_24%)]" />
        <div aria-hidden="true" className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div aria-hidden="true" className="absolute -right-32 bottom-12 h-80 w-80 rounded-full border border-gray-200/60" />
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-gray-200/50" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-black">Encuéntranos</h2>
            <h3 className="mb-6 text-4xl font-bebas md:text-5xl">VISITA THE BURGERY</h3>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">Aquí se preparan burgers con amor. Ven, visitanos y disfruta la experiencia The Burgery.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={cateringContainer} className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 text-left md:mt-16 md:grid-cols-2 md:gap-8">
            <motion.article variants={locationItem} whileHover={shouldReduceMotion ? undefined : { y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }} className="flex min-h-[430px] flex-col items-center text-center rounded-[28px] border border-gray-200/80 bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_22px_48px_rgba(0,0,0,0.12)] sm:p-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-lg">
                <FiMapPin size={27} aria-hidden="true" />
              </div>
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Tu próxima parada</p>
                <h4 className="text-3xl font-bebas tracking-[0.12em] text-black">DIRECCIÓN</h4>
              </div>
              <address className="not-italic text-gray-600">
                <p className="text-lg font-semibold text-gray-900">Calle 22 Norte #14-11</p>
                <p className="mt-3 text-base">Barrio Laureles</p>
                <p className="mt-1 text-base">Armenia, Quindío</p>
                <p className="mt-1 text-base">Colombia</p>
              </address>
              <div className="mt-auto pt-10">
                <a href="https://www.google.com/maps/search/?api=1&query=Calle+22+Norte+14-11,+Armenia,+Quindio,+Colombia" target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] sm:w-auto">
                  Ver en Google Maps
                </a>
              </div>
            </motion.article>

            <motion.article variants={locationItem} whileHover={shouldReduceMotion ? undefined : { y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }} className="flex min-h-[430px] flex-col items-center text-center rounded-[28px] border border-gray-200/80 bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_22px_48px_rgba(0,0,0,0.12)] sm:p-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-lg">
                <FiClock size={27} aria-hidden="true" />
              </div>
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Te esperamos</p>
                <h4 className="text-3xl font-bebas tracking-[0.12em] text-black">HORARIO</h4>
              </div>
              <div className="text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">Domingo a Jueves</p>
                  <p className="mt-2 text-base">12:00 PM - 3:00 PM</p>
                  <p className="mt-1 text-base">5:00 PM - 9:00 PM</p>
                </div>
                <div className="my-6 border-t border-gray-200" />
                <div>
                  <p className="font-semibold text-gray-900">Viernes y Sábado</p>
                  <p className="mt-2 text-base">12:00 PM - 3:00 PM</p>
                  <p className="mt-1 text-base">5:00 PM - 11:00 PM</p>
                </div>
              </div>
              <div className="mt-auto pt-10">
                <a href="https://wa.me/573248450908" target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] sm:w-auto">
                  Contáctanos
                </a>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

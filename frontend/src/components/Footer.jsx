import React from 'react';
import { Link } from 'react-router-dom';
import logoblanco from "../assets/images/logoblanco.png";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-3xl font-bebas text-primary tracking-widest">
              <Link to="/">
                <img
                  src={logoblanco}
                  alt="The Burgery"
                  className="h-20 lg:h-40 w-auto"
                />
              </Link></h2>
            <p className="text-gray-400 text-sm">Las mejores hamburguesas premium de la ciudad. Calidad y sabor inigualables.</p>
          </div>
          <div>
            <h3 className="text-xl font-bebas mb-4">Ubicación & Horario</h3>
            <p className="text-gray-400 text-sm mb-2">Calle 22 Norte # 14-11</p>
          </div>
          <div>
            <h3 className="text-xl font-bebas mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-white text-sm transition-colors">Menú</Link></li>
              <li><a href="https://wa.me/573248450908" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Contacto WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} The Burgery. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

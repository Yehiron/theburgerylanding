import React from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiGrid } from 'react-icons/fi';

export default function AdminLayout() {
  const token = localStorage.getItem('admin_token');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bebas text-primary tracking-widest">THE BURGERY</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium">
            <FiHome /> Dashboard
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <FiGrid /> Ver Sitio
          </a>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main data-scroll-container className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

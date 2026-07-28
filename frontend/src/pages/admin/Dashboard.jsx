import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const token = localStorage.getItem('admin_token');

  const { register: regCat, handleSubmit: submitCat, reset: resetCat } = useForm();
  const { register: regProd, handleSubmit: submitProd, reset: resetProd } = useForm();
  
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/products`)
      ]);
      setCategories(cRes.data);
      setProducts(pRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onAddCategory = async (data) => {
    try {
      await axios.post(`${API_URL}/api/categories`, data, { headers });
      resetCat();
      fetchData();
    } catch (e) { console.error(e); }
  };

  const onDeleteCategory = async (id) => {
    if(window.confirm('¿Eliminar categoría?')) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`, { headers });
        fetchData();
      } catch (e) { console.error(e); }
    }
  };

  const onAddProduct = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price);
      formData.append('category_id', data.category_id);
      formData.append('is_featured', data.is_featured);
      formData.append('is_available', data.is_available);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      await axios.post(`${API_URL}/api/products`, formData, { 
        headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
      });
      resetProd();
      fetchData();
    } catch (e) { console.error(e); }
  };

  const onDeleteProduct = async (id) => {
    if(window.confirm('¿Eliminar producto?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`, { headers });
        fetchData();
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bebas text-dark">Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-white border'}`}
          >
            Productos
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'categories' ? 'bg-primary text-white' : 'bg-white border'}`}
          >
            Categorías
          </button>
        </div>
      </div>

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
            <form onSubmit={submitCat(onAddCategory)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre</label>
                <input {...regCat('name', {required: true})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Orden</label>
                <input type="number" {...regCat('order')} defaultValue={0} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
              </div>
              <button type="submit" className="w-full bg-dark text-white py-3 rounded-lg font-bold hover:bg-primary transition-colors flex justify-center items-center gap-2">
                <FiPlus /> Crear Categoría
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Lista de Categorías</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">ID</th>
                    <th className="p-4 font-semibold text-gray-600">Nombre</th>
                    <th className="p-4 font-semibold text-gray-600">Orden</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{c.id}</td>
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4">{c.order}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => onDeleteCategory(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay categorías</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>
            <form onSubmit={submitProd(onAddProduct)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre</label>
                <input {...regProd('name', {required: true})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea {...regProd('description')} className="w-full p-2 border rounded-lg outline-none focus:border-primary" rows="2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Precio ($)</label>
                  <input type="number" step="0.01" {...regProd('price', {required: true})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoría</label>
                  <select {...regProd('category_id', {required: true})} className="w-full p-2 border rounded-lg outline-none focus:border-primary">
                    <option value="">Selecciona...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagen</label>
                <input type="file" accept="image/*" {...regProd('image')} className="w-full p-2 border rounded-lg outline-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...regProd('is_featured')} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked {...regProd('is_available')} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">Disponible</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-dark text-white py-3 rounded-lg font-bold hover:bg-primary transition-colors flex justify-center items-center gap-2 mt-4">
                <FiPlus /> Crear Producto
              </button>
            </form>
          </div>
          
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Img</th>
                    <th className="p-4 font-semibold text-gray-600">Nombre</th>
                    <th className="p-4 font-semibold text-gray-600">Precio</th>
                    <th className="p-4 font-semibold text-gray-600">Cat</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {p.image_url ? (
                           <img src={`${API_URL}${p.image_url}`} alt={p.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                           <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">No</div>
                        )}
                      </td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">${p.price}</td>
                      <td className="p-4">{categories.find(c => c.id === p.category_id)?.name || p.category_id}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => onDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay productos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

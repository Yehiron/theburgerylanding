import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FiAlertCircle, FiCheckCircle, FiEdit2, FiLoader, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || '';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const money = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

const emptyProduct = { name: '', description: '', price: '', category_id: '', order: 0, is_featured: false, is_available: true };

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const { register: regCat, handleSubmit: submitCat, reset: resetCat, setValue: setCategoryValue, formState: { errors: categoryErrors } } = useForm({ defaultValues: { name: '', order: 0 } });
  const { register: regProd, handleSubmit: submitProd, reset: resetProd, setValue: setProductValue, formState: { errors: productErrors } } = useForm({ defaultValues: emptyProduct });

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4500);
  };

  const errorMessage = (error, fallback) => error.response?.data?.detail || fallback;

  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([axios.get(`${API_URL}/api/categories`), axios.get(`${API_URL}/api/products`)]);
      setCategories(cRes.data);
      setProducts(pRes.data);
    } catch (error) {
      showNotice('error', 'No fue posible cargar los datos. Intenta actualizar la página.');
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => () => { if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  const resetProductForm = () => {
    resetProd(emptyProduct);
    setEditingProduct(null);
    setImageError('');
    setImagePreview('');
  };

  const onSaveCategory = async (data) => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/api/categories/${editingCategory.id}`, data, { headers });
        showNotice('success', 'Categoría actualizada correctamente.');
      } else {
        await axios.post(`${API_URL}/api/categories`, data, { headers });
        showNotice('success', 'Categoría creada correctamente.');
      }
      resetCat({ name: '', order: 0 });
      setEditingCategory(null);
      await fetchData();
    } catch (error) {
      showNotice('error', errorMessage(error, 'No se pudo guardar la categoría.'));
    } finally { setIsSaving(false); }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryValue('name', category.name);
    setCategoryValue('order', category.order);
  };

  const onDeleteCategory = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, { headers });
      showNotice('success', 'Categoría eliminada.');
      fetchData();
    } catch (error) { showNotice('error', errorMessage(error, 'No se pudo eliminar la categoría.')); }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = '';
      setImagePreview('');
      setImageError('La imagen supera 5 MB. Selecciona una más liviana.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      event.target.value = '';
      setImagePreview('');
      setImageError('El archivo debe ser una imagen.');
      return;
    }
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSaveProduct = async (data) => {
    if (imageError) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      ['name', 'description', 'price', 'category_id', 'order'].forEach((field) => formData.append(field, data[field] ?? ''));
      formData.append('is_featured', Boolean(data.is_featured));
      formData.append('is_available', Boolean(data.is_available));
      if (data.image?.[0]) formData.append('image', data.image[0]);
      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct.id}`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
        showNotice('success', 'Producto actualizado correctamente.');
      } else {
        await axios.post(`${API_URL}/api/products`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
        showNotice('success', 'Producto creado correctamente.');
      }
      resetProductForm();
      await fetchData();
    } catch (error) {
      showNotice('error', errorMessage(error, 'No se pudo guardar el producto. Revisa los datos e inténtalo de nuevo.'));
    } finally { setIsSaving(false); }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    resetProd({ ...emptyProduct, ...product, category_id: String(product.category_id) });
    setImageError('');
    setImagePreview(product.image_url ? `${API_URL}${product.image_url}` : '');
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDeleteProduct = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, { headers });
      showNotice('success', 'Producto eliminado.');
      fetchData();
    } catch (error) { showNotice('error', errorMessage(error, 'No se pudo eliminar el producto.')); }
  };

  const inputClass = 'w-full p-2 border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary';

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bebas text-dark">Dashboard</h1>
        <div className="flex gap-2">
          {['products', 'categories'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === tab ? 'bg-black text-white' : 'bg-white border'}`}>{tab === 'products' ? 'Productos' : 'Categorías'}</button>)}
        </div>
      </div>

      {notice && <div role="alert" className={`mb-6 flex items-center gap-2 rounded-xl p-4 ${notice.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{notice.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />} {notice.text}</div>}

      {activeTab === 'categories' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <form onSubmit={submitCat(onSaveCategory)} className="space-y-4">
            <div><label className="block text-sm font-semibold mb-1">Nombre</label><input {...regCat('name', { required: 'El nombre es obligatorio.' })} className={inputClass} />{categoryErrors.name && <p className="text-red-600 text-xs mt-1">{categoryErrors.name.message}</p>}</div>
            <div><label className="block text-sm font-semibold mb-1">Orden</label><input type="number" min="0" {...regCat('order', { valueAsNumber: true, min: { value: 0, message: 'El orden no puede ser negativo.' } })} className={inputClass} />{categoryErrors.order && <p className="text-red-600 text-xs mt-1">{categoryErrors.order.message}</p>}</div>
            <div className="flex gap-2"><button disabled={isSaving} type="submit" className="flex-1 bg-dark text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-60">{isSaving ? <FiLoader className="animate-spin" /> : <FiPlus />}{editingCategory ? 'Guardar cambios' : 'Crear Categoría'}</button>{editingCategory && <button type="button" onClick={() => { setEditingCategory(null); resetCat({ name: '', order: 0 }); }} className="px-4 border rounded-lg"><FiX /></button>}</div>
          </form>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Lista de Categorías</h2><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4">Nombre</th><th className="p-4">Orden</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody>{categories.map((c) => <tr key={c.id} className="border-b"><td className="p-4 font-medium">{c.name}</td><td className="p-4">{c.order}</td><td className="p-4 text-right"><button title="Editar" onClick={() => editCategory(c)} className="text-blue-600 p-2"><FiEdit2 /></button><button title="Eliminar" onClick={() => onDeleteCategory(c.id)} className="text-red-500 p-2"><FiTrash2 /></button></td></tr>)}{!categories.length && <tr><td colSpan="3" className="p-4 text-center text-gray-500">No hay categorías</td></tr>}</tbody></table>
        </div>
      </div>}

      {activeTab === 'products' && <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={submitProd(onSaveProduct)} className="space-y-4">
            <div><label className="block text-sm font-semibold mb-1">Nombre</label><input {...regProd('name', { required: 'El nombre es obligatorio.' })} className={inputClass} />{productErrors.name && <p className="text-red-600 text-xs mt-1">{productErrors.name.message}</p>}</div>
            <div><label className="block text-sm font-semibold mb-1">Descripción</label><textarea {...regProd('description')} className={inputClass} rows="2" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold mb-1">Precio ($)</label><input type="number" min="0" step="1" {...regProd('price', { required: 'El precio es obligatorio.', valueAsNumber: true, min: { value: 0, message: 'El precio no puede ser negativo.' } })} className={inputClass} />{productErrors.price && <p className="text-red-600 text-xs mt-1">{productErrors.price.message}</p>}</div><div><label className="block text-sm font-semibold mb-1">Categoría</label><select {...regProd('category_id', { required: 'Selecciona una categoría.' })} className={inputClass}><option value="">Selecciona...</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{productErrors.category_id && <p className="text-red-600 text-xs mt-1">{productErrors.category_id.message}</p>}</div></div>
            <div><label className="block text-sm font-semibold mb-1">Orden de aparición</label><input type="number" min="0" {...regProd('order', { valueAsNumber: true, min: { value: 0, message: 'El orden no puede ser negativo.' } })} className={inputClass} /><p className="text-xs text-gray-500 mt-1">Los números menores aparecen primero.</p></div>
            <div><label className="block text-sm font-semibold mb-1">Imagen {editingProduct && '(opcional)'}</label><input type="file" accept="image/jpeg,image/png,image/webp" {...regProd('image')} onChange={handleImageChange} className={inputClass} />{imageError && <p className="text-red-600 text-xs mt-1">{imageError}</p>}{imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-3 h-36 w-full rounded-lg object-cover" />}</div>
            <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" {...regProd('is_featured')} /> <span className="text-sm">Destacado</span></label><label className="flex items-center gap-2"><input type="checkbox" {...regProd('is_available')} /> <span className="text-sm">Disponible</span></label></div>
            <div className="flex gap-2"><button disabled={isSaving || Boolean(imageError)} type="submit" className="flex-1 bg-dark text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-60">{isSaving ? <FiLoader className="animate-spin" /> : <FiPlus />}{editingProduct ? 'Guardar cambios' : 'Crear Producto'}</button>{editingProduct && <button type="button" onClick={resetProductForm} className="px-4 border rounded-lg" title="Cancelar edición"><FiX /></button>}</div>
          </form>
        </div>
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto"><h2 className="text-xl font-bold mb-4">Lista de Productos</h2><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4">Img</th><th className="p-4">Nombre</th><th className="p-4">Precio</th><th className="p-4">Orden</th><th className="p-4">Cat.</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody>{products.map((p) => <tr key={p.id} className="border-b"><td className="p-4">{p.image_url ? <img src={`${API_URL}${p.image_url}`} alt={p.name} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded" />}</td><td className="p-4 font-medium">{p.name}</td><td className="p-4">${money.format(p.price)}</td><td className="p-4">{p.order}</td><td className="p-4">{categories.find((c) => c.id === p.category_id)?.name || p.category_id}</td><td className="p-4 text-right"><button title="Editar" onClick={() => editProduct(p)} className="text-blue-600 p-2"><FiEdit2 /></button><button title="Eliminar" onClick={() => onDeleteProduct(p.id)} className="text-red-500 p-2"><FiTrash2 /></button></td></tr>)}{!products.length && <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay productos</td></tr>}</tbody></table></div>
      </div>}
    </div>
  );
}

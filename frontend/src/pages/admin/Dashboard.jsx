import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiAlertCircle, FiCheckCircle, FiChevronDown, FiChevronUp, FiEdit2, FiLoader, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || '';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const money = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

const emptyProduct = { name: '', description: '', price: '', category_id: '', order: 0, is_featured: false, is_available: true, options: [] };

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
  const [productSearch, setProductSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const categoryName = (product) => categories.find((c) => c.id === product.category_id)?.name || '';

  const displayedProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();
    let list = term ? products.filter((p) => p.name.toLowerCase().includes(term)) : products;
    if (sortField) {
      list = [...list].sort((a, b) => {
        const valueA = sortField === 'category' ? categoryName(a) : a.name;
        const valueB = sortField === 'category' ? categoryName(b) : b.name;
        const comparison = valueA.localeCompare(valueB, 'es', { sensitivity: 'base' });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    return list;
  }, [products, categories, productSearch, sortField, sortDirection]);

  const sortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />;
  };

  const { register: regCat, handleSubmit: submitCat, reset: resetCat, setValue: setCategoryValue, formState: { errors: categoryErrors } } = useForm({ defaultValues: { name: '', order: 0, is_highlighted: false } });
  const { register: regProd, handleSubmit: submitProd, reset: resetProd, control: productControl, setValue: setProductValue, formState: { errors: productErrors } } = useForm({ defaultValues: emptyProduct });
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({ control: productControl, name: 'options' });
  const { ref: imageFieldRef, ...imageFieldProps } = regProd('image');
  const imageInputRef = useRef(null);
  const clearImageInput = () => {
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

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
    clearImageInput();
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
      resetCat({ name: '', order: 0, is_highlighted: false });
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
    setCategoryValue('is_highlighted', Boolean(category.is_highlighted));
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
      const cleanOptions = (data.options || [])
        .filter((option) => option.name?.trim())
        .map((option, index) => ({ name: option.name.trim(), price: Number(option.price) || 0, order: index }));
      formData.append('options', JSON.stringify(cleanOptions));
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
    clearImageInput();
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

  const toggleAvailability = async (product) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description ?? '');
    formData.append('price', product.price);
    formData.append('category_id', product.category_id);
    formData.append('order', product.order);
    formData.append('is_featured', Boolean(product.is_featured));
    formData.append('is_available', !product.is_available);
    formData.append('options', JSON.stringify((product.options || []).map((o) => ({ name: o.name, price: o.price, order: o.order }))));
    try {
      await axios.put(`${API_URL}/api/products/${product.id}`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
      showNotice('success', product.is_available ? 'Producto marcado como no disponible.' : 'Producto marcado como disponible.');
      fetchData();
    } catch (error) { showNotice('error', errorMessage(error, 'No se pudo actualizar la disponibilidad.')); }
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
            <label className="flex items-center gap-2"><input type="checkbox" {...regCat('is_highlighted')} /> <span className="text-sm">Destacada (botón dorado animado en el menú)</span></label>
            <div className="flex gap-2"><button disabled={isSaving} type="submit" className="flex-1 bg-dark text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-60">{isSaving ? <FiLoader className="animate-spin" /> : <FiPlus />}{editingCategory ? 'Guardar cambios' : 'Crear Categoría'}</button>{editingCategory && <button type="button" onClick={() => { setEditingCategory(null); resetCat({ name: '', order: 0, is_highlighted: false }); }} className="px-4 border rounded-lg"><FiX /></button>}</div>
          </form>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Lista de Categorías</h2><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4">Nombre</th><th className="p-4">Orden</th><th className="p-4">Destacada</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody>{categories.map((c) => <tr key={c.id} className="border-b"><td className="p-4 font-medium">{c.name}</td><td className="p-4">{c.order}</td><td className="p-4">{c.is_highlighted ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Destacada</span> : <span className="text-gray-400 text-xs">—</span>}</td><td className="p-4 text-right"><button title="Editar" onClick={() => editCategory(c)} className="text-blue-600 p-2"><FiEdit2 /></button><button title="Eliminar" onClick={() => onDeleteCategory(c.id)} className="text-red-500 p-2"><FiTrash2 /></button></td></tr>)}{!categories.length && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay categorías</td></tr>}</tbody></table>
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
            <div><label className="block text-sm font-semibold mb-1">Imagen {editingProduct && '(opcional)'}</label><input type="file" accept="image/jpeg,image/png,image/webp" {...imageFieldProps} ref={(el) => { imageFieldRef(el); imageInputRef.current = el; }} onChange={handleImageChange} className={inputClass} />{imageError && <p className="text-red-600 text-xs mt-1">{imageError}</p>}{imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-3 h-36 w-full rounded-lg object-cover" />}</div>
            <div>
              <label className="block text-sm font-semibold mb-1">Opciones (ej. sabores, tamaños)</label>
              <p className="text-xs text-gray-500 mb-2">Si agregas opciones, el cliente deberá elegir una al agregar el producto al carrito, y se cobrará el precio de la opción elegida (el "Precio ($)" de arriba ya no se suma; solo se usa si el producto no tiene opciones). Déjalo vacío si el producto no las necesita.</p>
              <div className="space-y-3">
                {optionFields.map((field, index) => (
                  <div key={field.id} className="p-3 border rounded-lg space-y-2">
                    <input placeholder="Nombre (ej. Mango)" {...regProd(`options.${index}.name`)} className={inputClass} />
                    <div className="flex gap-2 items-center">
                      <input type="number" min="0" step="1" placeholder="Precio de esta opción" {...regProd(`options.${index}.price`, { valueAsNumber: true })} className={`${inputClass} flex-1`} />
                      <button type="button" onClick={() => removeOption(index)} className="p-2 text-red-500 shrink-0" title="Quitar opción"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => appendOption({ name: '', price: '' })} className="mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600"><FiPlus /> Agregar opción</button>
            </div>
            <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" {...regProd('is_featured')} /> <span className="text-sm">Destacado</span></label><label className="flex items-center gap-2"><input type="checkbox" {...regProd('is_available')} /> <span className="text-sm">Disponible</span></label></div>
            <div className="flex gap-2"><button disabled={isSaving || Boolean(imageError)} type="submit" className="flex-1 bg-dark text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-60">{isSaving ? <FiLoader className="animate-spin" /> : <FiPlus />}{editingProduct ? 'Guardar cambios' : 'Crear Producto'}</button>{editingProduct && <button type="button" onClick={resetProductForm} className="px-4 border rounded-lg" title="Cancelar edición"><FiX /></button>}</div>
          </form>
        </div>
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista de Productos</h2>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4">Img</th><th className="p-4 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('name')}>Nombre {sortIcon('name')}</th><th className="p-4">Precio</th><th className="p-4">Orden</th><th className="p-4 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('category')}>Cat. {sortIcon('category')}</th><th className="p-4">Estado</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody>{displayedProducts.map((p) => <tr key={p.id} className="border-b"><td className="p-4">{p.image_url ? <img src={`${API_URL}${p.image_url}`} alt={p.name} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded" />}</td><td className="p-4 font-medium">{p.name}</td><td className="p-4">${money.format(p.price)}</td><td className="p-4">{p.order}</td><td className="p-4">{categoryName(p) || p.category_id}</td><td className="p-4"><button onClick={() => toggleAvailability(p)} title={p.is_available ? 'Marcar como no disponible' : 'Marcar como disponible'} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${p.is_available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{p.is_available ? 'Disponible' : 'No disponible'}</button></td><td className="p-4 text-right"><button title="Editar" onClick={() => editProduct(p)} className="text-blue-600 p-2"><FiEdit2 /></button><button title="Eliminar" onClick={() => onDeleteProduct(p.id)} className="text-red-500 p-2"><FiTrash2 /></button></td></tr>)}{!displayedProducts.length && <tr><td colSpan="7" className="p-4 text-center text-gray-500">{products.length ? 'Ningún producto coincide con la búsqueda.' : 'No hay productos'}</td></tr>}</tbody></table>
        </div>
      </div>}
    </div>
  );
}

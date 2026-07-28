import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuPage />} />
          </Route>
          
          {/* Rutas de Administrador */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

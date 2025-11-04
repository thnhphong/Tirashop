import './App.css';
import './index.css';
import 'remixicon/fonts/remixicon.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './Home';
import About from './components/About';
import Contact from './components/Contact';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProducts from './components/Admin/AdminProducts';
import AdminOrder from './components/Admin/AdminOrder';
import ProductDetail from './components/ProductDetail';
import { Routes, Route } from 'react-router-dom';
import OurProducts from './components/Main/OurProducts';
import { CartProvider } from './context/CartContext';
import Favorites from './components/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import Menu from './components/Menu';
import CheckoutPage from './components/Checkout';
import Profile from './components/Profile';
import ProfilePage from './components/Profile';

const isWhitelist = !!localStorage.getItem('isWhitelist');
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<OurProducts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={isWhitelist ? <Favorites /> : <Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrder />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* route for menu */}
            <Route path='/menu/:id' element={<Menu />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import CustomerPage from './pages/CustomerPage';
import ProductPage from './pages/ProductPage';
import SalePage from './pages/SalePage';
import StorePage from './pages/StorePage';
import 'bootstrap/dist/css/bootstrap.min.css';

// ✅ Debug log to confirm production API URL
console.log("🌍 VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <NavigationBar />
                <div className="container flex-grow-1 px-4 py-3 bg-light">
                    <Routes>
                        <Route path="/" element={<Navigate to="/customers" />} />
                        <Route path="/customers" element={<CustomerPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/sale" element={<SalePage />} />
                        <Route path="/stores" element={<StorePage />} />
                        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                    </Routes>
                </div>

                <footer className="bg-dark text-white text-center py-2 mt-auto">
                    <small>&copy; 2025 Store Manager App</small>
                </footer>
            </div>
        </Router>
    );
}

export default App;

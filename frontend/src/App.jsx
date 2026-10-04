import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TechnicianAuth from "./pages/TechnicianAuth";
import Home from "./pages/Home";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import SearchTechnicians from "./pages/SearchTechnicians";
import MyBookings from "./pages/MyBookings";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";

import ProtectedRoute from "./components/ProtectedRoute";


import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC HOME */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/technician-auth"
            element={<TechnicianAuth />}
          />

          {/* PUBLIC SERVICE BROWSING */}
          <Route path="/services" element={<Services />} />

          {/* SEARCH TECHNICIANS */}
          <Route
            path="/search-technicians"
            element={
              <ProtectedRoute>
                <SearchTechnicians />
              </ProtectedRoute>
            }
          />

          {/* CART */}
          <Route path="/cart" element={<Cart />} />

          {/* CHECKOUT */}
          <Route path="/checkout" element={<Checkout />} />

          {/* PAYMENT */}
          <Route path="/payment" element={<Payment />} />

          {/* ORDER SUCCESS */}
          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* BOOKINGS */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* OLD SEARCH ROUTE */}
          <Route
            path="/search"
            element={<Services />}
          />

          {/* UNKNOWN URL */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
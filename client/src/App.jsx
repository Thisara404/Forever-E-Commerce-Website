import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Store imports
import { fetchCart, clearCart } from "./store/slices/cartSlice";
import { useAuth } from "./hooks/useReduxSelectors";
import ReduxBridge from "./context/ReduxBridge";

// Component imports - make sure all are imported
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import AdminFloatingButton from "./components/AdminFloatingButton";
import ServerStatus from "./components/ServerStatus";

// Admin Components
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import AdminLayout from "./pages/admin/AdminLayout";

const App = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, initialized } = useAuth();

  // Only handle cart fetching - auth initialization is done in ReduxBridge
  useEffect(() => {
    // Only run cart logic after auth is initialized
    if (initialized) {
      if (isAuthenticated && token) {
        console.log("🛒 User authenticated, fetching cart...");
        dispatch(fetchCart());
      } else {
        console.log("🧹 User not authenticated, clearing cart...");
        dispatch(clearCart());
      }
    }
  }, [initialized, isAuthenticated, token, dispatch]);

  return (
    <ReduxBridge>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <ServerStatus />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AdminFloatingButton />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <NavBar />
                <SearchBar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:productID" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/place-order" element={<PlaceOrder />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                </Routes>
                <Footer />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </div>
    </ReduxBridge>
  );
};

export default App;

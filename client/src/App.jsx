import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import AdminFloatingButton from './components/AdminFloatingButton' // Add this
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Admin Components
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import UserManagement from './pages/admin/UserManagement'
import Analytics from './pages/admin/Analytics'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <AdminFloatingButton /> {/* Add this */}
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={
          <>
            <NavBar />
            <SearchBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/collection' element={<Collection />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:productID' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/login' element={<Login />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/payment/success' element={<PaymentSuccess />} />
              <Route path='/payment/cancel' element={<PaymentCancel />} />
            </Routes>
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </div>
  )
}

export default App

import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Note: Ensure 'cart.jsx' and 'Cart.jsx' are not duplicates in your folder
import Login from './assets/components/Login'

import Reg from './assets/components/Reg'
import Cart from './assets/components/cart'
import AddProduct from './assets/components/AddProduct'
import Home from './assets/components/Home'
import Order from './assets/components/Order'
import ProductDetails from './assets/components/product'
import Checkout from './assets/components/Checkout'
import EditProduct from './assets/components/EditProduct'
import UserList from './assets/components/UserList'
import UserDetails from './assets/components/UserDetails'
import Edituserbyid from './assets/components/Edituserbyid'
import DeleteUser from './assets/components/DeleteUser'
import Chat from './assets/components/Chat'
import ChatList from './assets/components/ChatList'
import MyAds from './assets/components/MyAds'


const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = `${savedTheme}-mode`;
  }, []);

  return (
    < BrowserRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Reg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path='/edituser/:id' element={<Edituserbyid />} />
        <Route path='deleteuser/:id' element={<DeleteUser />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/my-ads" element={<MyAds />} />

      </Routes>
    </BrowserRouter >


  )
}

export default App

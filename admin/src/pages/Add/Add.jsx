import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Lấy link Render từ file assets
import { url } from './assets/assets'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          {/* 2. QUAN TRỌNG: Truyền url={url} vào tất cả các trang */}
          
          <Route path="/" element={<Login url={url}/>} />
          
          <Route path="/add" element={<Add url={url}/>} />
          
          <Route path="/list" element={<List url={url}/>} />
          
          <Route path="/orders" element={<Orders url={url}/>} />
          
        </Routes>
      </div>
    </div>
  )
}

export default App
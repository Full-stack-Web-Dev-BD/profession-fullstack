import React from 'react'
import Navbar from './pages/Components/Navbar';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Task from './pages/Task';
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Navbar />
      <div className='container mt-4'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/task" element={<Task />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

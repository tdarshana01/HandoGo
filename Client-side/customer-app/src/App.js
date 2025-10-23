import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login, Signup } from './components/Auth';
import Dashboard from './components/Dashboard';
import RequestService from './pages/RequestService';
import RequestConfirm from './pages/RequestConfirm';
import MyJobs from './pages/MyJobs';
import Workers from './pages/Workers';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-service" element={<RequestService />} />
          <Route path="/request/confirm" element={<RequestConfirm />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/workers" element={<Workers />} />
          {/* Add more routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

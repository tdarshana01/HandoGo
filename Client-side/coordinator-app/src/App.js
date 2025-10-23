import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Workers from './pages/Workers';
import ServiceRequests from './pages/ServiceRequests';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/service-requests" replace />} />
          <Route path="workers" element={<Workers />} />
          <Route path="service-requests" element={<ServiceRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

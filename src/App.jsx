import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
            <Route path="/details/:id" element={<div>Details Coming Soon</div>} />
            <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

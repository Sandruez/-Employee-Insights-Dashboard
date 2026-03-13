import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<div>Login Page Coming Soon</div>} />
          <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
          <Route path="/details/:id" element={<div>Details Coming Soon</div>} />
          <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TravelAnalysis from './pages/TravelAnalysis';
import Recommendations from './pages/Recommendations';
import Analytics from './pages/Analytics';
import './index.css';
import logo from './media/GGAI_logo.png';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {/* NAVBAR */}
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-20 sm:h-24 flex items-center">

              {/* LEFT: LOGO */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="GreenGuard Logo"
                  className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto cursor-pointer"
                />
              </Link>

              {/* CENTER: DESKTOP NAV */}
              <div className="flex-1 hidden md:flex justify-center space-x-8">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/analytics" className="nav-link">Analytics</Link>
                <Link to="/travel" className="nav-link">Travel Analysis</Link>
                <Link to="/recommendations" className="nav-link">Recommendations</Link>
              </div>

              {/* RIGHT: MOBILE MENU BUTTON */}
              <button
                className="md:hidden ml-auto text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
              <div className="md:hidden pb-4 space-y-2 text-center">
                <Link to="/" onClick={() => setMenuOpen(false)} className="block nav-link">
                  Dashboard
                </Link>
                <Link to="/analytics" onClick={() => setMenuOpen(false)} className="block nav-link">
                  Analytics
                </Link>
                <Link to="/travel" onClick={() => setMenuOpen(false)} className="block nav-link">
                  Travel Analysis
                </Link>
                <Link to="/recommendations" onClick={() => setMenuOpen(false)} className="block nav-link">
                  Recommendations
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/travel" element={<TravelAnalysis />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;

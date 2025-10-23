import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSVG from '../assets/Logo.png';
import ProfileImg from '../assets/Profile .png';

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const keys = ['token', 'authToken', 'accessToken', 'auth_token', 'user'];
    keys.forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={LogoSVG} alt="HandiGO" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-gray-900">HandiGO</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-gray-700">Dashboard</button>
            <button onClick={() => navigate('/my-jobs')} className="text-sm font-medium text-gray-700">My Jobs</button>
            <button onClick={() => navigate('/workers')} className="text-sm font-medium text-gray-700">Gig Marketplace</button>
            <button className="text-sm font-medium text-gray-700">About Us</button>
          </nav>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search for services..." className="px-3 py-1 border border-gray-300 rounded text-sm hidden md:inline" />
            <button onClick={() => navigate('/request-service')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded">Request a Service</button>
            <button onClick={handleSignOut} className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 hidden md:inline rounded transition-colors">Sign Out</button>
            <img src={ProfileImg} alt="Profile" onClick={() => navigate('/my-jobs')} className="w-10 h-10 rounded-full cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

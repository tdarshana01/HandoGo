import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import LogoImg from '../assets/Logo.png';

const Sidebar = () => {

  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      null
    );
  };

  const PROFILE_BASE =  'https://service-production-8a3c.up.railway.app';

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('auth');
      if (urlToken) {
        let tokenToStore = urlToken;
        try {
          const decoded = atob(urlToken);
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.token) {
            tokenToStore = parsed.token;
            try { localStorage.setItem('user', JSON.stringify(parsed.user)); } catch (e) {}
          }
        } catch (e) {
        }
        try { localStorage.setItem('authToken', tokenToStore); } catch (e) {}

        try {
          const u = new URL(window.location.href);
          u.searchParams.delete('auth');
          window.history.replaceState({}, document.title, u.pathname + u.search);
        } catch (e) {
        }
      }
    } catch (e) {
    }
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fullName || parsed.name) {
          const n = parsed.fullName || parsed.name;
          setName(n);
          setInitials(getInitials(n));
          setRole(parsed.role || 'Admin');
        }
      }
    } catch (e) {
    }

    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${PROFILE_BASE}/api/v1/auth/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          console.warn('Profile fetch failed:', res.status, errBody);
          setLoading(false);
          return;
        }
        const json = await res.json().catch(() => ({}));
        const user = json.user || json.data || json;
        if (user && (user.fullName || user.name)) {
          const n = user.fullName || user.name;
          setName(n);
          setInitials(getInitials(n));
          setRole(user.role || 'Coordinator');
          try { localStorage.setItem('user', JSON.stringify({ fullName: n, role: user.role })); } catch(e){}
          setLoading(false);
        }
      } catch (err) {
        console.error('Profile fetch failed', err);
        setLoading(false);
      }
    };

    fetchProfile();

    const handleStorage = (e) => {
      if (!e) return;
      if (e.key === 'authToken' || e.key === 'user') {
        fetchProfile();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const getInitials = (n) => {
    if (!n) return '';
    return n.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
  };

  const signOut = () => {
    const keys = ['token', 'authToken', 'accessToken', 'auth_token', 'user'];
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = 'https://servicecustomer-app.netlify.app/login';
  };
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img src={LogoImg} alt="HandiGO" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-gray-900">HandiGO</span>
        </div>
  <p className="text-sm text-purple-600 mt-1 font-medium">Service Admin Hub</p>
      </div>

      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">{initials}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{loading ? 'Loading...' : (name || 'Guest')}</p>
            <p className="text-xs text-gray-500">{loading ? '' : (role || '')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 rounded-lg transition-colors"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

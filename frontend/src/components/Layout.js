import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Magomba Trust</h1>
          <p className="text-sm text-gray-400">Microfinance System</p>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          <NavLink to="/dashboard" icon="📊" label="Dashboard" />
          <NavLink to="/groups" icon="👥" label="Groups" />
          <NavLink to="/loans" icon="💰" label="Loans" />
          <NavLink to="/clock" icon="⏰" label="World Clock" />
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-900">
          <div className="text-sm mb-4">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-gray-200"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
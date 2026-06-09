import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2 text-2xl">💳</div>
            <div>
              <h1 className="text-xl font-bold">Magomba</h1>
              <p className="text-xs text-gray-400">Trust</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-6 space-y-2 px-4 pb-20">
          <NavLink 
            to="/dashboard" 
            icon="📊" 
            label="Dashboard" 
            active={isActive('/dashboard')}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink 
            to="/groups" 
            icon="👥" 
            label="Groups" 
            active={isActive('/groups')}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink 
            to="/loans" 
            icon="💰" 
            label="Loans" 
            active={isActive('/loans')}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink 
            to="/loans/new" 
            icon="➕" 
            label="New Loan" 
            active={isActive('/loans/new')}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink 
            to="/clock" 
            icon="⏰" 
            label="World Clock" 
            active={isActive('/clock')}
            onClick={() => setMobileMenuOpen(false)}
          />
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-400">Logged in as</p>
            <p className="font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Magomba Trust</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user?.name?.split(' ')[0]}</span>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
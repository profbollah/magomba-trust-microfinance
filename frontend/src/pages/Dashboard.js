import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalAmount: 0,
    totalRepaid: 0,
    activeLoans: 0,
    totalGroups: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const loansRes = await axios.get(`${API_URL}/loans`);
      const paymentsRes = await axios.get(`${API_URL}/payments`);
      const groupsRes = await axios.get(`${API_URL}/groups`);

      const loans = loansRes.data;
      const payments = paymentsRes.data;
      const groups = groupsRes.data;

      const totalAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.loan_amount), 0);
      const totalRepaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      const activeLoans = loans.filter(l => l.status === 'disbursed').length;

      setStats({
        totalLoans: loans.length,
        totalAmount,
        totalRepaid,
        activeLoans,
        totalGroups: groups.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Magomba Trust</h1>
        <p className="text-blue-100">Microfinance Management System - Simple & Professional</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Groups" 
          value={stats.totalGroups}
          icon="👥"
          color="bg-purple-50 text-purple-600"
          bgColor="bg-purple-600"
        />
        <StatCard 
          title="Total Loans" 
          value={stats.totalLoans}
          icon="📋"
          color="bg-blue-50 text-blue-600"
          bgColor="bg-blue-600"
        />
        <StatCard 
          title="Total Amount" 
          value={`TSh ${(stats.totalAmount / 1000000).toFixed(1)}M`}
          icon="💰"
          color="bg-green-50 text-green-600"
          bgColor="bg-green-600"
        />
        <StatCard 
          title="Active Loans" 
          value={stats.activeLoans}
          icon="⚡"
          color="bg-orange-50 text-orange-600"
          bgColor="bg-orange-600"
        />
        <StatCard 
          title="Repaid" 
          value={`TSh ${(stats.totalRepaid / 1000000).toFixed(1)}M`}
          icon="✅"
          color="bg-emerald-50 text-emerald-600"
          bgColor="bg-emerald-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton 
            to="/loans/new" 
            icon="➕" 
            title="New Loan" 
            description="Create a new loan"
            color="bg-blue-600 hover:bg-blue-700"
          />
          <ActionButton 
            to="/loans" 
            icon="📊" 
            title="View Loans" 
            description="See all loans"
            color="bg-green-600 hover:bg-green-700"
          />
          <ActionButton 
            to="/groups" 
            icon="👥" 
            title="Groups" 
            description="Manage groups"
            color="bg-purple-600 hover:bg-purple-700"
          />
          <ActionButton 
            to="/clock" 
            icon="⏰" 
            title="World Clock" 
            description="Multiple timezones"
            color="bg-orange-600 hover:bg-orange-700"
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard 
          icon="🎯" 
          title="Simple" 
          description="Easy to use interface designed for everyone"
        />
        <InfoCard 
          icon="⚡" 
          title="Fast" 
          description="Quick loan processing and payment tracking"
        />
        <InfoCard 
          icon="🔒" 
          title="Secure" 
          description="Encrypted data with secure authentication"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }) {
  return (
    <div className={`${color} rounded-lg p-6 text-center transform transition hover:scale-105`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm font-semibold opacity-75 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ to, icon, title, description, color }) {
  return (
    <Link
      to={to}
      className={`${color} text-white rounded-lg p-6 text-center transition transform hover:scale-105 shadow-md`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </Link>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-600">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
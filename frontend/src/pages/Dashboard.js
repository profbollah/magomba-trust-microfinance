import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalAmount: 0,
    totalRepaid: 0,
    activeLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const loansRes = await axios.get(`${API_URL}/loans`);
        const paymentsRes = await axios.get(`${API_URL}/payments`);

        const loans = loansRes.data;
        const payments = paymentsRes.data;

        const totalAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.loan_amount), 0);
        const totalRepaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const activeLoans = loans.filter(l => l.status === 'disbursed').length;

        setStats({
          totalLoans: loans.length,
          totalAmount,
          totalRepaid,
          activeLoans
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Loans" 
          value={stats.totalLoans}
          icon="📊"
        />
        <StatCard 
          title="Total Amount (TSh)" 
          value={stats.totalAmount.toLocaleString()}
          icon="💰"
        />
        <StatCard 
          title="Total Repaid (TSh)" 
          value={stats.totalRepaid.toLocaleString()}
          icon="✅"
        />
        <StatCard 
          title="Active Loans" 
          value={stats.activeLoans}
          icon="⏳"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
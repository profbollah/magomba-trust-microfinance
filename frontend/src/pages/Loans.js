import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Loans() {
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  const fetchLoans = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get(`${API_URL}/loans`, { params });
      setLoans(response.data);
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
          <p className="text-gray-600">Loading loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">💰 Loans</h1>
          <p className="text-gray-600 mt-1">Manage all loan requests and disbursements</p>
        </div>
        <Link 
          to="/loans/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
        >
          ➕ New Loan
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-3">
          {['all', 'pending', 'approved', 'disbursed', 'paid'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Borrower</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (
                  <tr key={loan.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{loan.borrower_name}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">TSh {parseFloat(loan.loan_amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{loan.duration_months} months</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/loans/${loan.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-gray-600 font-semibold">No loans found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
    approved: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✓' },
    disbursed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
    paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '✓' },
    defaulted: { bg: 'bg-red-100', text: 'text-red-800', icon: '✗' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
      {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
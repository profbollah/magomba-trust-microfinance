import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function LoanDetail() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/loans/${id}`);
      setLoan(response.data.loan);
      setDocuments(response.data.documents);
      setPayments(response.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!loan) return <div className="text-center py-8">Loan not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Loan Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Loan Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Borrower:</span>
              <span className="font-semibold">{loan.borrower_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount (TSh):</span>
              <span className="font-semibold">{parseFloat(loan.loan_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate:</span>
              <span className="font-semibold">{loan.interest_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{loan.duration_months} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                loan.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {loan.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Documents</h2>
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{doc.document_type}</span>
                  <a href={API_URL + doc.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    View
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No documents uploaded</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b">
                  <td className="px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">TSh {parseFloat(payment.amount).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded bg-gray-100 text-xs">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <p className="text-center text-gray-500 py-4">No payments recorded</p>
          )}
        </div>
      </div>
    </div>
  );
}
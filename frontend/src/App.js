import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Loans from './pages/Loans';
import LoanDetail from './pages/LoanDetail';
import NewLoan from './pages/NewLoan';
import ClockPage from './pages/Clock';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/new" element={<NewLoan />} />
            <Route path="/loans/:id" element={<LoanDetail />} />
            <Route path="/clock" element={<ClockPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
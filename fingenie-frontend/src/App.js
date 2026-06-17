 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import Investments from './pages/Investments';
import FraudAlerts from './pages/FraudAlerts';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
 
 
 
const CustomerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: '100vh',
        fontSize: '24px', color: '#667eea'
    }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    return children;
};
 
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: '100vh',
        fontSize: '24px', color: '#667eea'
    }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
    return children;
};
 
function App() {
   
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password"
                        element={<ForgotPassword />} />
                    <Route path="/dashboard" element={
                        <CustomerRoute>
                            <Dashboard />
                        </CustomerRoute>
                    } />
                    <Route path="/loans" element={
                        <CustomerRoute>
                            <Loans />
                        </CustomerRoute>
                    } />
                    <Route path="/investments" element={
                        <CustomerRoute>
                            <Investments />
                        </CustomerRoute>
                    } />
                    <Route path="/fraud" element={
                        <CustomerRoute>
                            <FraudAlerts />
                        </CustomerRoute>
                    } />
                    <Route path="/chatbot" element={
                        <CustomerRoute>
                            <Chatbot />
                        </CustomerRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="/"
                        element={<Navigate to="/login" />} />
                    <Route path="*"
                        element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
 
export default App;
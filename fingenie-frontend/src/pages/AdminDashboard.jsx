import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, fraudAPI } from '../services/api';
 
const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [fraudAlerts, setFraudAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerTx, setCustomerTx] = useState([]);
    const [txLoading, setTxLoading] = useState(false);
 
    useEffect(() => {
        if (user?.role !== 'ADMIN') navigate('/dashboard');
        loadData();
    }, []);
 
    const loadData = async () => {
        try {
            const usersRes = await adminAPI.getAllUsers();
            setUsers(usersRes.data);
            const statsRes = await adminAPI.getStats();
            setStats(statsRes.data);
            const fraudRes = await fraudAPI.getFraudAlerts();
            setFraudAlerts(fraudRes.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
 
    const viewCustomerDetails = async (customer) => {
        setSelectedCustomer(customer);
        setTxLoading(true);
        try {
            const res = await adminAPI
                .getCustomerTransactions(customer.email);
            setCustomerTx(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setTxLoading(false);
        }
    };
 
    if (loading) return (
        <div style={styles.loading}>
            Loading Admin Dashboard...
        </div>
    );
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <div style={styles.navLeft}>
                    <h1 style={styles.logo}>🤖FinGenie AI</h1>
                    <span style={styles.adminBadge}>ADMIN</span>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.adminName}>
                        {user?.fullName}
                    </span>
                    <button style={styles.logoutBtn}
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </nav>
 
            {selectedCustomer && (
                <div style={styles.overlay}>
                    <div style={styles.customerModal}>
                        <div style={styles.modalHeader}>
                            <h3>Customer Details</h3>
                            <button style={styles.closeBtn}
                                onClick={() => {
                                    setSelectedCustomer(null);
                                    setCustomerTx([]);
                                }}>
                                Close
                            </button>
                        </div>
 
                        <div style={styles.customerInfo}>
                            <div style={styles.avatar}>
                                {selectedCustomer.fullName?.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>
                                    {selectedCustomer.fullName}
                                </h3>
                                <p style={{ margin: 0, color: '#666' }}>
                                    {selectedCustomer.email}
                                </p>
                            </div>
                        </div>
 
                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <p style={styles.infoKey}>
                                    Account Number
                                </p>
                                <p style={styles.infoVal}>
                                    {selectedCustomer.accountNumber}
                                </p>
                            </div>
                            <div style={styles.infoItem}>
                                <p style={styles.infoKey}>Balance</p>
                                <p style={{
                                    ...styles.infoVal,
                                    color: '#2ed573'
                                }}>
                                    Rs.{Number(selectedCustomer.balance)
                                        .toLocaleString()}
                                </p>
                            </div>
                            <div style={styles.infoItem}>
                                <p style={styles.infoKey}>
                                    Today Transactions
                                </p>
                                <p style={styles.infoVal}>
                                    {selectedCustomer.todayTransactions}
                                </p>
                            </div>
                            <div style={styles.infoItem}>
                                <p style={styles.infoKey}>
                                    Total Transactions
                                </p>
                                <p style={styles.infoVal}>
                                    {selectedCustomer.totalTransactions}
                                </p>
                            </div>
                        </div>
 
                        <h4>Transaction History</h4>
                        {txLoading ? (
                            <p>Loading transactions...</p>
                        ) : customerTx.length === 0 ? (
                            <p style={{ color: '#666' }}>
                                No transactions found
                            </p>
                        ) : (
                            <div style={styles.txList}>
                                {customerTx.map(tx => (
                                    <div key={tx.id}
                                        style={{
                                            ...styles.txItem,
                                            background: tx.fraudulent
                                                ? '#fff0f0' : 'white',
                                            border: tx.fraudulent
                                                ? '1px solid #ff4757'
                                                : '1px solid #f0f0f0',
                                        }}>
                                        <div style={styles.txLeft}>
                                            <span style={styles.txType}>
                                                {tx.type}
                                            </span>
                                            <span style={styles.txDesc}>
                                                {tx.description}
                                            </span>
                                            <span style={styles.txCat}>
                                                {tx.category}
                                            </span>
                                        </div>
                                        <div style={styles.txRight}>
                                            <span style={{
                                                fontWeight: '700',
                                                color: tx.type === 'DEPOSIT'
                                                    ? '#2ed573' : '#ff4757'
                                            }}>
                                                {tx.type === 'DEPOSIT'
                                                    ? '+' : '-'}
                                                Rs.{tx.amount}
                                            </span>
                                            <span style={{
                                                background: tx.riskScore > 0.7
                                                    ? '#ffe0e0' : tx.riskScore > 0.4
                                                    ? '#fff3e0' : '#e0ffe0',
                                                color: tx.riskScore > 0.7
                                                    ? '#c00' : tx.riskScore > 0.4
                                                    ? '#c60' : '#060',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                            }}>
                                                Risk: {(tx.riskScore * 100)
                                                    .toFixed(0)}%
                                            </span>
                                            {tx.fraudulent && (
                                                <span style={styles.fraudTag}>
                                                    FRAUD
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
 
            <div style={styles.content}>
                <h2> 📊 Admin Analytics Dashboard</h2>
 
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <h2 style={styles.statNumber}>
                            {stats.totalUsers || 0}
                        </h2>
                        <p style={styles.statLabel}>👥 Total Users</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={styles.statNumber}>
                            {stats.totalAccounts || 0}
                        </h2>
                        <p style={styles.statLabel}>🏦Total Accounts</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={styles.statNumber}>
                            {stats.totalTransactions || 0}
                        </h2>
                        <p style={styles.statLabel}>
                            💳Total Transactions
                        </p>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderTop: '4px solid #ff4757'
                    }}>
                        <h2 style={{
                            ...styles.statNumber,
                            color: '#ff4757'
                        }}>
                            {stats.fraudAlerts || 0}
                        </h2>
                        <p style={styles.statLabel}>❗Fraud Alerts</p>
                    </div>
                </div>
 
                <div style={styles.tabRow}>
                 
 
{['overview', 'customers', 'fraud', 'apis'].map(tab => (
                        <button key={tab}
                            style={{
                                ...styles.tabBtn,
                                background: activeTab === tab
                                    ? '#667eea' : '#f0f0f0',
                                color: activeTab === tab
                                    ? 'white' : '#333',
                            }}
                            onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
 
                {activeTab === 'overview' && (
                    <div style={styles.card}>
                        <h3>📊System Overview</h3>
                        <div style={styles.overviewGrid}>
                            <div style={styles.overviewItem}>
                                <strong>💸Total Balance</strong>
                                <span style={{ color: '#2ed573' }}>
                                    Rs.{users.reduce((sum, u) =>
                                        sum + (u.balance || 0), 0
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div style={styles.overviewItem}>
                                <strong>📅Today Transactions</strong>
                                <span>
                                    {users.reduce((sum, u) =>
                                        sum + (u.todayTransactions || 0), 0
                                    )}
                                </span>
                            </div>
                            <div style={styles.overviewItem}>
                                <strong>⚠️ Fraud Rate</strong>
                                <span style={{ color: '#ff4757' }}>
                                    {stats.totalTransactions > 0
                                        ? ((stats.fraudAlerts /
                                            stats.totalTransactions) * 100
                                        ).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                            <div style={styles.overviewItem}>
                                <strong>✅Active Accounts</strong>
                                <span>{stats.totalAccounts || 0}</span>
                            </div>
                        </div>
 
                        <h3 style={{ marginTop: '24px' }}>
                           🧩  Module Status
                        </h3>
                        {[
                            'Authentication and JWT Security',
                            'Banking Operations',
                            'AI Fraud Detection Engine',
                            'AI Loan Prediction',
                            'AI Investment Advisor',
                            'AI Chat Assistant',
                            'MFA Two Factor Authentication',
                            'QR Payment System',
                            'Strategy Pattern Fraud Detection',
                            'Factory Pattern Transactions',
                        ].map((module, i) => (
                            <div key={i} style={styles.moduleItem}>
                                <span>{module}</span>
                                <span style={styles.activeBadge}>
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                )}
 
                {activeTab === 'customers' && (
                    <div style={styles.card}>
                        <h3>🗂️Customer Management</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            Click on any customer to view
                            full details and transactions
                        </p>
                        {users.filter(u => u.role === 'CUSTOMER')
                            .length === 0 ? (
                            <p>No customers found</p>
                        ) : (
                            users.filter(u => u.role === 'CUSTOMER')
                                .map((u, i) => (
                                <div key={i}
                                    style={styles.customerCard}
                                    onClick={() =>
                                        viewCustomerDetails(u)}>
                                    <div style={styles.customerHeader}>
                                        <div style={styles.avatar}>
                                            {u.fullName?.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <strong>{u.fullName}</strong>
                                            <p style={styles.customerEmail}>
                                                {u.email}
                                            </p>
                                        </div>
                                        <span style={styles.viewBtn}>
                                            View Details
                                        </span>
                                    </div>
                                    <div style={styles.customerStats}>
                                        <div style={styles.customerStat}>
                                            <p style={styles.statKey}>
                                                Account
                                            </p>
                                            <p style={styles.statVal}>
                                                {u.accountNumber}
                                            </p>
                                        </div>
                                        <div style={styles.customerStat}>
                                            <p style={styles.statKey}>
                                                Balance
                                            </p>
                                            <p style={{
                                                ...styles.statVal,
                                                color: '#2ed573'
                                            }}>
                                                Rs.{Number(u.balance)
                                                    .toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={styles.customerStat}>
                                            <p style={styles.statKey}>
                                                Today Tx
                                            </p>
                                            <p style={styles.statVal}>
                                                {u.todayTransactions}
                                            </p>
                                        </div>
                                        <div style={styles.customerStat}>
                                            <p style={styles.statKey}>
                                                Total Tx
                                            </p>
                                            <p style={styles.statVal}>
                                                {u.totalTransactions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
 
                {activeTab === 'fraud' && (
                    <div style={styles.card}>
                        <h3>❗Fraud Alerts</h3>
                        {fraudAlerts.length === 0 ? (
                            <p style={{ color: '#060' }}>
                                No fraudulent transactions!
                            </p>
                        ) : (
                            fraudAlerts.map(alert => (
                                <div key={alert.id}
                                    style={styles.alertItem}>
                                    <span>#{alert.id}</span>
                                    <span>{alert.type}</span>
                                    <span>Rs.{alert.amount}</span>
                                    <span style={{
                                        background: alert.riskScore > 0.7
                                            ? '#ffe0e0' : '#fff3e0',
                                        color: alert.riskScore > 0.7
                                            ? '#c00' : '#c60',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}>
                                        Risk: {(alert.riskScore * 100)
                                            .toFixed(0)}%
                                    </span>
                                    <span style={styles.fraudBadge}>
                                        FRAUD
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
 
                {activeTab === 'apis' && (
                    <div style={styles.card}>
                        <h3>🌐API Endpoints</h3>
                        {[
                            { method: 'POST', url: '/api/auth/register' },
                            { method: 'POST', url: '/api/auth/login' },
                            { method: 'POST', url: '/api/auth/reset-password' },
                            { method: 'POST', url: '/api/mfa/generate' },
                            { method: 'POST', url: '/api/mfa/verify' },
                            { method: 'GET', url: '/api/banking/account' },
                            { method: 'POST', url: '/api/banking/deposit' },
                            { method: 'POST', url: '/api/banking/withdraw' },
                            { method: 'POST', url: '/api/banking/transfer' },
                            { method: 'GET', url: '/api/banking/transactions' },
                            { method: 'POST', url: '/api/loans/apply' },
                            { method: 'GET', url: '/api/loans/emi-calculator' },
                            { method: 'POST', url: '/api/investments/add' },
                            { method: 'GET', url: '/api/investments/mutual-fund-suggestions' },
                            { method: 'GET', url: '/api/investments/savings-recommendation' },
                            { method: 'GET', url: '/api/fraud/alerts' },
                            { method: 'POST', url: '/api/fraud/risk-score' },
                            { method: 'POST', url: '/api/chat/ask' },
                     
 
     { method: 'GET', url: '/api/admin/users' },
                            { method: 'GET', url: '/api/admin/stats' },
                        ].map((ep, i) => (
                            <div key={i} style={styles.endpointItem}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{
                                        background: ep.method === 'GET'
                                            ? '#e0ffe0' : '#e0f0ff',
                                        color: ep.method === 'GET'
                                            ? '#060' : '#00c',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                    }}>
                                        {ep.method}
                                    </span>
                                    <code style={styles.code}>
                                        {ep.url}
                                    </code>
                                </div>
                                <span style={styles.activeBadge}>
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
const styles = {
    loading: {
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: '100vh',
        fontSize: '20px', color: '#667eea',
    },
    container: { minHeight: '100vh', background: '#f0f2f5' },
    nav: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    logo: { color: 'white', margin: 0, fontSize: '20px' },
    adminBadge: {
        background: '#ffd700', color: '#000',
        padding: '4px 12px', borderRadius: '12px',
        fontWeight: '700', fontSize: '12px',
    },
    adminName: { color: 'white', fontSize: '14px' },
    logoutBtn: {
        background: '#ff4757', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    overlay: {
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 1000,
    },
    customerModal: {
        background: 'white', borderRadius: '16px',
        padding: '32px', width: '700px',
        maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px',
    },
    closeBtn: {
        background: '#ff4757', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    customerInfo: {
        display: 'flex', alignItems: 'center',
        gap: '16px', marginBottom: '24px',
        padding: '16px', background: '#f9f9f9',
        borderRadius: '12px',
    },
    avatar: {
        width: '48px', height: '48px',
        borderRadius: '50%', background: '#667eea',
        color: 'white', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '20px',
    },
    infoGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px', marginBottom: '24px',
    },
    infoItem: {
        background: '#f9f9f9', padding: '12px',
        borderRadius: '8px', textAlign: 'center',
    },
    infoKey: {
        margin: 0, color: '#666',
        fontSize: '11px', fontWeight: '600',
    },
    infoVal: {
        margin: '4px 0 0', fontWeight: '700',
        fontSize: '14px', color: '#333',
    },
    txList: { maxHeight: '300px', overflowY: 'auto' },
    txItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px',
        borderRadius: '8px', marginBottom: '8px',
    },
    txLeft: {
        display: 'flex', flexDirection: 'column', gap: '2px',
    },
    txType: { fontWeight: '600', fontSize: '14px' },
    txDesc: { fontSize: '12px', color: '#666' },
    txCat: {
        fontSize: '11px', color: '#667eea',
        fontWeight: '600',
    },
    txRight: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: '4px',
    },
    fraudTag: {
        background: '#ffe0e0', color: '#c00',
        padding: '2px 8px', borderRadius: '8px',
        fontSize: '10px', fontWeight: '700',
    },
    content: {
        maxWidth: '1000px', margin: '32px auto',
        padding: '0 16px',
    },
    statsRow: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '24px',
    },
    statCard: {
        background: 'white', borderRadius: '16px',
        padding: '24px', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderTop: '4px solid #667eea',
    },
    statNumber: {
        fontSize: '32px', fontWeight: '700',
        color: '#667eea', margin: 0,
    },
    statLabel: {
        color: '#666', margin: '8px 0 0', fontSize: '14px',
    },
    tabRow: {
        display: 'flex', gap: '12px', marginBottom: '24px',
    },
    tabBtn: {
        padding: '10px 24px', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', fontSize: '14px',
    },
    card: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    overviewGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '16px',
    },
    overviewItem: {
        background: '#f9f9f9', padding: '16px',
        borderRadius: '12px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: '8px',
    },
    moduleItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    activeBadge: {
        background: '#e0ffe0', color: '#060',
        padding: '4px 12px', borderRadius: '12px',
        fontSize: '12px', fontWeight: '600',
    },
    customerCard: {
        background: '#f9f9f9', borderRadius: '12px',
        padding: '16px', marginBottom: '12px',
        cursor: 'pointer', transition: 'all 0.2s',
        border: '2px solid transparent',
    },
    customerHeader: {
        display: 'flex', alignItems: 'center',
        gap: '12px', marginBottom: '12px',
    },
    customerEmail: {
        margin: 0, color: '#666', fontSize: '12px',
    },
    viewBtn: {
        background: '#667eea', color: 'white',
        padding: '6px 12px', borderRadius: '8px',
        fontSize: '12px', fontWeight: '600',
    },
    customerStats: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
    },
    customerStat: {
        background: 'white', padding: '12px',
        borderRadius: '8px', textAlign: 'center',
    },
    statKey: {
        margin: 0, color: '#666',
        fontSize: '11px', fontWeight: '600',
    },
    statVal: {
        margin: '4px 0 0', fontWeight: '700',
        fontSize: '14px', color: '#333',
    },
    alertItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    fraudBadge: {
        background: '#ffe0e0', color: '#c00',
        padding: '4px 12px', borderRadius: '12px',
        fontSize: '12px',
    },
    endpointItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '10px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    code: {
        fontFamily: 'monospace', fontSize: '13px',
        color: '#333', background: '#f5f5f5',
        padding: '4px 8px', borderRadius: '4px',
    },
}; 
 
export default AdminDashboard
 
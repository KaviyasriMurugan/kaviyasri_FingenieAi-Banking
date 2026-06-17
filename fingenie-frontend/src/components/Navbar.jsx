import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
 
    return (
        <nav style={styles.nav}>
            <h1 style={styles.logo}>FinGenie AI</h1>
            <div style={styles.links}>
                <button style={styles.btn}
                    onClick={() => navigate('/dashboard')}>
                    Dashboard
                </button>
                <button style={styles.btn}
                    onClick={() => navigate('/loans')}>
                    Loans
                </button>
                <button style={styles.btn}
                    onClick={() => navigate('/investments')}>
                    Investments
                </button>
                <button style={styles.btn}
                    onClick={() => navigate('/fraud')}>
                    Fraud Alerts
                </button>
                <button style={styles.btn}
                    onClick={() => navigate('/chatbot')}>
                    AI Chat
                </button>
                {user?.role === 'ADMIN' && (
                    <button style={styles.btn}
                        onClick={() => navigate('/admin')}>
                        Admin
                    </button>
                )}
                <button style={styles.logoutBtn}
                    onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};
 
const styles = {
    nav: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    logo: { color: 'white', margin: 0 },
    links: { display: 'flex', gap: '8px' },
    btn: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white', border: 'none',
        padding: '8px 16px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '14px',
    },
    logoutBtn: {
        background: '#ff4757', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
};
 
export default Navbar;
 
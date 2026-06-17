import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fraudAPI } from '../services/api';
 
const FraudAlerts = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [riskResult, setRiskResult] = useState(null);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('WITHDRAWAL');
 
    useEffect(() => {
        loadAlerts();
    }, []);
 
    const loadAlerts = async () => {
        try {
            const res = await fraudAPI.getFraudAlerts();
            setAlerts(res.data);
        } catch (err) {
            console.log(err);
        }
    };
 
    const checkRisk = async () => {
        try {
            const res = await fraudAPI.getRiskScore({ amount, type });
            setRiskResult(res.data);
        } catch (err) {
            console.log(err);
        }
    };
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}> FinGenie AI</h1>
                <button style={styles.backBtn}
                    onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
            </nav>
 
            <div style={styles.content}>
                <h2>Fraud Detection Engine!</h2>
 
                <div style={styles.card}>
                    <h3>Check Transaction Risk</h3>
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <select
                        style={styles.input}
                        value={type}
                        onChange={e => setType(e.target.value)}>
                        <option value="WITHDRAWAL">WITHDRAWAL</option>
                        <option value="DEPOSIT">DEPOSIT</option>
                        <option value="TRANSFER">TRANSFER</option>
                    </select>
                    <button style={styles.btn} onClick={checkRisk}>
                        Analyze Risk
                    </button>
 
                    {riskResult !== null && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            borderRadius: '8px',
                            background: riskResult > 0.7 ? '#ffe0e0' : '#e0ffe0',
                        }}>
                            <h3 style={{ margin: 0 }}>
                                Risk Score: {(riskResult * 100).toFixed(0)}%
                                {riskResult > 0.7 ? '  HIGH RISK' : ' LOW RISK'}
                            </h3>
                        </div>
                    )}
                </div>
 
                <div style={styles.card}>
                    <h3>Fraudulent Transactions</h3>
                    {alerts.length === 0 ? (
                        <p style={{ color: '#060' }}>
                             No fraudulent transactions detected!
                        </p>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} style={styles.alertItem}>
                                <span>Transaction #{alert.id}</span>
                                <span>₹{alert.amount}</span>
                                <span style={styles.fraudBadge}>🚨 FRAUD</span>
                                <span>Risk: {(alert.riskScore * 100).toFixed(0)}%</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
 
const styles = {
    container: { minHeight: '100vh', background: '#f0f2f5' },
    nav: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    logo: { color: 'white', margin: 0 },
    backBtn: {
        background: 'rgba(255,255,255,0.2)', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    content: { maxWidth: '800px', margin: '32px auto', padding: '0 16px' },
    card: {
        background: 'white', borderRadius: '16px', padding: '24px',
        marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    input: {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: '2px solid #e0e0e0', fontSize: '14px',
        boxSizing: 'border-box', marginBottom: '12px',
    },
    btn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
    },
    alertItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    fraudBadge: {
        background: '#ffe0e0', color: '#c00',
        padding: '4px 12px', borderRadius: '12px', fontSize: '12px',
    },
};
 
export default FraudAlerts;
 
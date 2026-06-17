import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { investmentAPI } from '../services/api';
 
const Investments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [investments, setInvestments] = useState([]);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [message, setMessage] = useState('');
    const [fundName, setFundName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [riskLevel, setRiskLevel] = useState('LOW');
    const [suggestions, setSuggestions] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
 
    useEffect(() => {
        loadInvestments();
        loadSuggestions('LOW');
    }, []);
 
    const loadInvestments = async () => {
        try {
            const res = await investmentAPI.getMyInvestments(user.email);
            setInvestments(res.data);
            const val = await investmentAPI.getPortfolioValue(user.email);
            setPortfolioValue(val.data);
            const rec = await investmentAPI.getSavingsRecommendation(user.email);
            setRecommendation(rec.data);
        } catch (err) {
            console.log(err);
        }
    };
 
    const loadSuggestions = async (risk) => {
        try {
            const res = await investmentAPI.getMutualFundSuggestions(risk);
            setSuggestions(res.data);
        } catch (err) {
            console.log(err);
        }
    };
 
    const handleAdd = async () => {
        try {
            await investmentAPI.addInvestment({
                email: user.email,
                fundName, amount, riskLevel, category
            });
            setMessage('Investment added successfully!');
            setFundName('');
            setAmount('');
            setCategory('');
            loadInvestments();
        } catch {
            setMessage('Failed to add investment!');
        }
    };
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>FinGenie AI</h1>
                <button style={styles.backBtn}
                    onClick={() => navigate('/dashboard')}>
                    Back
                </button>
            </nav>
 
            <div style={styles.content}>
                <h2>AI Investment Advisor</h2>
 
                <div style={styles.portfolioCard}>
                    <p style={{ opacity: 0.8, margin: 0 }}>
                        Total Portfolio Value
                    </p>
                    <h2 style={{ margin: '8px 0 0', fontSize: '36px' }}>
                        Rs.{Number(portfolioValue).toLocaleString()}
                    </h2>
                </div>
 
                {recommendation && (
                    <div style={styles.recCard}>
                        <h3>AI Savings Recommendation</h3>
                        <p style={{ color: '#333' }}>{recommendation.message}</p>
                        <div style={styles.recRow}>
                            <div style={styles.recItem}>
                                <strong>Suggested SIP</strong>
                                <p>Rs.{recommendation.suggestedSIP}/month</p>
                            </div>
                            <div style={styles.recItem}>
                                <strong>Risk Profile</strong>
                                <p>{recommendation.riskProfile}</p>
                            </div>
                        </div>
                    </div>
                )}
 
                <div style={styles.card}>
                    <h3>Mutual Fund Suggestions</h3>
                    <div style={styles.riskBtns}>
                        {['LOW', 'MEDIUM', 'HIGH'].map(r => (
                            <button key={r}
                                style={{
                                    ...styles.riskBtn,
                                    background: riskLevel === r ?
                                        '#667eea' : '#f0f0f0',
                                    color: riskLevel === r ? 'white' : '#333',
                                }}
                                onClick={() => {
                                    setRiskLevel(r);
                                    loadSuggestions(r);
                                }}>
                                {r} Risk
                            </button>
                        ))}
                    </div>
                    {suggestions.map((fund, i) => (
                        <div key={i} style={styles.fundItem}>
                            <div>
                                <strong>{fund.name}</strong>
                                <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                                    {fund.category}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, color: '#2ed573', fontWeight: '600' }}>
                                    {fund.expectedReturns}
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                    Expected Returns
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
 
                {message && (
                    <div style={styles.message}>{message}</div>
                )}
 
                <div style={styles.card}>
                    <h3>Add Investment</h3>
                    <input style={styles.input}
                        placeholder="Fund Name"
                        value={fundName}
                        onChange={e => setFundName(e.target.value)} />
                    <input style={styles.input}
                        placeholder="Amount" type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)} />
                    <input style={styles.input}
                        placeholder="Category (e.g. Mutual Fund)"
                        value={category}
                        onChange={e => setCategory(e.target.value)} />
                    <select style={styles.input}
                        value={riskLevel}
                        onChange={e => setRiskLevel(e.target.value)}>
                        <option value="LOW">Low Risk</option>
                        <option value="MEDIUM">Medium Risk</option>
                        <option value="HIGH">High Risk</option>
                    </select>
                    <button style={styles.btn} onClick={handleAdd}>
                        Add Investment
                    </button>
                </div>
 
                <div style={styles.card}>
                    <h3>My Portfolio</h3>
                    {investments.length === 0 ? (
                        <p>No investments yet</p>
                    ) : (
                        investments.map(inv => (
                            <div key={inv.id} style={styles.invItem}>
                                <div>
                                    <strong>{inv.fundName}</strong>
                                    <p style={{
                                        margin: 0, color: '#666',
                                        fontSize: '12px'
                                    }}>
                                        {inv.category}
                                    </p>
                                </div>
                                <span>
                                    Rs.{Number(inv.investedAmount).toLocaleString()}
                                </span>
                                <span style={{
                                    background: inv.riskLevel === 'LOW' ?
                                        '#e0ffe0' : inv.riskLevel === 'MEDIUM' ?
                                        '#fff3e0' : '#ffe0e0',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}>
                                    {inv.riskLevel}
                                </span>
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
    portfolioCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px', padding: '32px',
        color: 'white', marginBottom: '24px',
    },
    recCard: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #667eea',
    },
    recRow: { display: 'flex', gap: '24px', marginTop: '12px' },
    recItem: {
        background: '#f0f2f5', padding: '12px',
        borderRadius: '8px', flex: 1, textAlign: 'center',
    },
    card: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    riskBtns: { display: 'flex', gap: '12px', marginBottom: '16px' },
    riskBtn: {
        padding: '8px 20px', border: 'none',
        borderRadius: '20px', cursor: 'pointer',
        fontWeight: '600',
    },
    fundItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
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
    message: {
        background: '#e0ffe0', color: '#060',
        padding: '10px', borderRadius: '8px', marginBottom: '16px',
    },
    invItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
};
 
export default Investments;
 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanAPI } from '../services/api';
import LoanCard from '../components/LoanCard';
 
const Loans = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [emi, setEmi] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [formData, setFormData] = useState({
        loanAmount: '',
        tenureMonths: '',
        annualIncome: '',
        creditScore: '',
        employmentType: 'SALARIED',
        loanType: 'PERSONAL_LOAN'
    });
    const [emiForm, setEmiForm] = useState({
        amount: '',
        tenure: '12',
        rate: '10.5'
    });
 
    useEffect(() => { loadLoans(); }, []);
 
    const loadLoans = async () => {
        try {
            const res = await loanAPI.getMyLoans(user.email);
            setLoans(res.data);
        } catch (err) { console.log(err); }
    };
 
    const handleApply = async () => {
        if (!formData.loanAmount || !formData.tenureMonths ||
            !formData.annualIncome || !formData.creditScore) {
            setMessage('Please fill all fields!');
            setMessageType('error');
            return;
        }
        try {
            await loanAPI.applyLoan({
                ...formData, email: user.email
            });
            setMessage('Loan application submitted successfully!');
            setMessageType('success');
            loadLoans();
        } catch (err) {
            setMessage(err.response?.data?.message ||
                'Application failed!');
            setMessageType('error');
        }
    };
 
    const handleEMI = async () => {
        if (!emiForm.amount || !emiForm.tenure || !emiForm.rate) {
            return;
        }
        try {
            const res = await loanAPI.calculateEMI(
                emiForm.amount, emiForm.tenure, emiForm.rate);
            setEmi(res.data);
        } catch { console.log('EMI error'); }
    };
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>🤖FinGenie AI</h1>
                <button style={styles.backBtn}
                    onClick={() => navigate('/dashboard')}>
                    Back
                </button>
            </nav>
 
            <div style={styles.content}>
                <h2>Smart Loan Management</h2>
 
                <div style={styles.card}>
                    <h3>EMI Calculator</h3>
                    <div style={styles.row}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Loan Amount (Rs.)
                            </label>
                            <input
                                style={styles.input}
                                type="number"
                                placeholder="Enter amount"
                                value={emiForm.amount}
                                min="1000"
                                onChange={e => setEmiForm({
                                    ...emiForm, amount: e.target.value
                                })}
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Tenure
                            </label>
                            <select style={styles.input}
                                value={emiForm.tenure}
                                onChange={e => setEmiForm({
                                    ...emiForm, tenure: e.target.value
                                })}>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months (1 Year)</option>
                                <option value="24">24 Months (2 Years)</option>
                                <option value="36">36 Months (3 Years)</option>
                                <option value="48">48 Months (4 Years)</option>
                                <option value="60">60 Months (5 Years)</option>
                                <option value="84">84 Months (7 Years)</option>
                                <option value="120">120 Months (10 Years)</option>
                                <option value="180">180 Months (15 Years)</option>
                                <option value="240">240 Months (20 Years)</option>
                                <option value="300">300 Months (25 Years)</option>
                                <option value="360">360 Months (30 Years)</option>
                            </select>
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Interest Rate
                            </label>
                            <select style={styles.input}
                                value={emiForm.rate}
                                onChange={e => setEmiForm({
                                    ...emiForm, rate: e.target.value
                                })}>
                                <option value="7">7% (Home Loan)</option>
                                <option value="8.5">8.5% (Home Loan Premium)</option>
                                <option value="9">9% (Car Loan)</option>
                                <option value="9.5">9.5% (Car Loan Premium)</option>
                                <option value="10.5">10.5% (Personal Loan)</option>
                                <option value="11">11% (Business Loan)</option>
                                <option value="12">12% (Education Loan)</option>
                                <option value="14">14% (Gold Loan)</option>
                                <option value="16">16% (Two Wheeler Loan)</option>
                                <option value="18">18% (Consumer Loan)</option>
                            </select>
                        </div>
                    </div>
                    <button style={styles.btn} onClick={handleEMI}>
                        Calculate EMI
                    </button>
                    {emi && (
                        <div style={styles.emiResult}>
                            <h3 style={{ margin: 0, color: '#667eea' }}>
                                Monthly EMI: Rs.{emi.toLocaleString()}
                            </h3>
                            <p style={{ margin: '8px 0 0', color: '#666' }}>
                                Total Amount: Rs.{(emi *
                                    parseInt(emiForm.tenure))
                                    .toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
 
                <div style={styles.card}>
                    <h3>Apply for Loan</h3>
                    {message && (
                        <div style={{
                            ...styles.message,
                            background: messageType === 'error'
                                ? '#ffe0e0' : '#e0ffe0',
                            color: messageType === 'error'
                                ? '#c00' : '#060',
                        }}>
                            {message}
                        </div>
                    )}
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Loan Type</label>
                        <select style={styles.input}
                            value={formData.loanType}
                            onChange={e => setFormData({
                                ...formData, loanType: e.target.value
                            })}>
                            <option value="PERSONAL_LOAN">
                                Personal Loan
                            </option>
                            <option value="HOME_LOAN">Home Loan</option>
                            <option value="CAR_LOAN">Car Loan</option>
                            <option value="EDUCATION_LOAN">
                                Education Loan
                            </option>
                            <option value="BUSINESS_LOAN">
                                Business Loan
                            </option>
                            <option value="GOLD_LOAN">Gold Loan</option>
                            <option value="TWO_WHEELER_LOAN">
                                Two Wheeler Loan
                            </option>
                        </select>
                    </div>
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>
                            Loan Amount (Rs.)
                        </label>
                        <input style={styles.input}
                            type="number"
                            placeholder="Enter loan amount"
                            value={formData.loanAmount}
                            min="10000"
                            onChange={e => setFormData({
                                ...formData, loanAmount: e.target.value
                            })}
                        />
                    </div>
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tenure</label>
                        <select style={styles.input}
                            value={formData.tenureMonths}
                            onChange={e => setFormData({
                                ...formData, tenureMonths: e.target.value
                            })}>
                            <option value="">Select Tenure</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months (1 Year)</option>
                            <option value="24">24 Months (2 Years)</option>
                            <option value="36">36 Months (3 Years)</option>
                            <option value="48">48 Months (4 Years)</option>
                            <option value="60">60 Months (5 Years)</option>
                            <option value="84">84 Months (7 Years)</option>
                            <option value="120">120 Months (10 Years)</option>
                            <option value="180">180 Months (15 Years)</option>
                            <option value="240">240 Months (20 Years)</option>
                            <option value="360">360 Months (30 Years)</option>
                        </select>
                    </div>
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>
                            Annual Income (Rs.)
                        </label>
                        <input style={styles.input}
                            type="number"
                            placeholder="Enter annual income"
                            
 
value={formData.annualIncome}
                            min="100000"
                            onChange={e => setFormData({
                                ...formData, annualIncome: e.target.value
                            })}
                        />
                    </div>
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>
                            Credit Score (300-900)
                        </label>
                        <input style={styles.input}
                            type="number"
                            placeholder="Enter credit score"
                            value={formData.creditScore}
                            min="300"
                            max="900"
                            onChange={e => setFormData({
                                ...formData, creditScore: e.target.value
                            })}
                        />
                        {formData.creditScore && (
                            <div style={{
                                marginTop: '4px',
                                fontSize: '12px',
                                color: formData.creditScore >= 750
                                    ? '#060' : formData.creditScore >= 650
                                    ? '#c60' : '#c00',
                                fontWeight: '600',
                            }}>
                                {formData.creditScore >= 750
                                    ? 'Excellent - High approval chance!'
                                    : formData.creditScore >= 650
                                    ? 'Good - Moderate approval chance'
                                    : formData.creditScore >= 600
                                    ? 'Average - Low approval chance'
                                    : 'Poor - Very low approval chance'}
                            </div>
                        )}
                    </div>
 
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Employment Type</label>
                        <select style={styles.input}
                            value={formData.employmentType}
                            onChange={e => setFormData({
                                ...formData, employmentType: e.target.value
                            })}>
                            <option value="SALARIED">Salaried</option>
                            <option value="SELF_EMPLOYED">
                                Self Employed
                            </option>
                            <option value="BUSINESS">Business Owner</option>
                            <option value="FREELANCER">Freelancer</option>
                            <option value="GOVERNMENT">
                                Government Employee
                            </option>
                        </select>
                    </div>
 
                    <button style={styles.btn} onClick={handleApply}>
                        Apply Now
                    </button>
                </div>
                <div style={styles.card}>
    <h3>Credit Score Analysis</h3>
    <p style={{ color: '#666', fontSize: '14px' }}>
        Enter your credit score to see analysis
    </p>
    <input
        style={styles.input}
        type="number"
        placeholder="Enter credit score (300-900)"
        min="300"
        max="900"
        value={formData.creditScore}
        onChange={e => setFormData({
            ...formData, creditScore: e.target.value
        })}
    />
    {formData.creditScore && (
        <div style={styles.creditAnalysis}>
            <div style={styles.creditScore}>
                <div style={{
                    width: `${((formData.creditScore - 300) / 600) * 100}%`,
                    height: '12px',
                    background: formData.creditScore >= 750
                        ? '#2ed573' : formData.creditScore >= 650
                        ? '#ffa502' : '#ff4757',
                    borderRadius: '6px',
                    transition: 'width 0.5s',
                }} />
            </div>
            <div style={styles.creditGrid}>
                <div style={styles.creditItem}>
                    <strong>Your Score</strong>
                    <p style={{
                        color: formData.creditScore >= 750
                            ? '#060' : formData.creditScore >= 650
                            ? '#c60' : '#c00',
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: '4px 0',
                    }}>
                        {formData.creditScore}
                    </p>
                </div>
                <div style={styles.creditItem}>
                    <strong>Rating</strong>
                    <p style={{ margin: '4px 0', fontWeight: '600' }}>
                        {formData.creditScore >= 750
                            ? 'Excellent'
                            : formData.creditScore >= 700
                            ? 'Very Good'
                            : formData.creditScore >= 650
                            ? 'Good'
                            : formData.creditScore >= 600
                            ? 'Average'
                            : 'Poor'}
                    </p>
                </div>
                <div style={styles.creditItem}>
                    <strong>Approval Chance</strong>
                    <p style={{ margin: '4px 0', fontWeight: '600' }}>
                        {formData.creditScore >= 750
                            ? 'Very High'
                            : formData.creditScore >= 700
                            ? 'High'
                            : formData.creditScore >= 650
                            ? 'Moderate'
                            : formData.creditScore >= 600
                            ? 'Low'
                            : 'Very Low'}
                    </p>
                </div>
                <div style={styles.creditItem}>
                    <strong>Interest Rate</strong>
                    <p style={{ margin: '4px 0', fontWeight: '600' }}>
                        {formData.creditScore >= 750
                            ? '8.5%'
                            : formData.creditScore >= 700
                            ? '10%'
                            : formData.creditScore >= 650
                            ? '12%'
                            : '14%+'}
                    </p>
                </div>
            </div>
 
            <div style={styles.creditTips}>
                <strong>Tips to improve:</strong>
                <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
                    {formData.creditScore >= 750
                        ? 'Excellent score! Maintain on-time payments to keep it high!'
                        : formData.creditScore >= 650
                        ? 'Good score! Pay all bills on time and reduce credit utilization!'
                        : 'Pay EMIs on time, reduce outstanding debts, and avoid multiple loan applications!'}
                </p>
            </div>
        </div>
    )}
</div>
 
                <div style={styles.card}>
                    <h3>My Loan Applications</h3>
                    {loans.length === 0 ? (
                        <p style={{ color: '#666' }}>No loans yet</p>
                    ) : (
                        loans.map(loan => (
                            <LoanCard key={loan.id} loan={loan} />
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
    content: {
        maxWidth: '800px', margin: '32px auto', padding: '0 16px'
    },
    card: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    row: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px', marginBottom: '12px',
    },
    fieldGroup: { marginBottom: '16px' },
    label: {
        display: 'block', marginBottom: '6px',
        color: '#333', fontWeight: '600', fontSize: '14px',
    },
    input: {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: '2px solid #e0e0e0', fontSize: '14px',
        boxSizing: 'border-box', outline: 'none',
    },
    btn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', fontSize: '16px',
    },
    emiResult: {
        marginTop: '16px', padding: '16px',
        background: '#f0f0ff', borderRadius: '12px',
        textAlign: 'center',
    },
    message: {
        padding: '10px', borderRadius: '8px',
        marginBottom: '16px', textAlign: 'center',
        fontWeight: '600',
    },
    creditAnalysis: {
    marginTop: '16px',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '12px',
},
creditScore: {
    background: '#e0e0e0',
    borderRadius: '6px',
    height: '12px',
    marginBottom: '16px',
},
creditGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '16px',
},
creditItem: {
    background: 'white',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '13px',
},
creditTips: {
    background: '#e8f4fd',
    padding: '12px',
    borderRadius: '8px',
    color: '#1a73e8',
    fontSize: '13px',
},
};
 
export default Loans;
 
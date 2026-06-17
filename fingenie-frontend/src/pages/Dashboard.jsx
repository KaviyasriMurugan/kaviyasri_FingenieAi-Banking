import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bankingAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import TransactionCard from '../components/TransactionCard';
import axios from 'axios';
 
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [otpPopup, setOtpPopup] = useState(false);
    const [otp, setOtp] = useState('');
    const [pendingTransfer, setPendingTransfer] = useState(null);
 
    useEffect(() => {
        loadAccount();
    }, []);
 
    const loadAccount = async () => {
        try {
            const res = await bankingAPI.getAccount(user.email);
            setAccount(res.data);
            const txRes = await bankingAPI.getTransactions(user.email);
            setTransactions(txRes.data);
        } catch {
            try {
                await bankingAPI.createAccount(user.email);
                loadAccount();
            } catch (err) {
                console.log(err);
            }
        }
    };
 
    const handleDeposit = async () => {
        if (!amount) return;
        setLoading(true);
        try {
            await bankingAPI.deposit({
                email: user.email,
                amount: parseFloat(amount)
            });
            setMessage('Deposit successful!');
            setAmount('');
            loadAccount();
        } catch {
            setMessage('Deposit failed!');
        } finally {
            setLoading(false);
        }
    };
 
    const handleWithdraw = async () => {
        if (!amount) return;
        setLoading(true);
        try {
            await bankingAPI.withdraw({
                email: user.email,
                amount: parseFloat(amount)
            });
            setMessage('Withdrawal successful!');
            setAmount('');
            loadAccount();
        } catch {
            setMessage('Insufficient balance!');
        } finally {
            setLoading(false);
        }
    };
 
    const handleTransfer = async () => {
        if (!amount || !toAccount) return;
        if (parseFloat(amount) > 10000) {
            setPendingTransfer({ amount, toAccount });
            await axios.post(
                `http://localhost:8080/api/mfa/generate?email=${user.email}`
            );
            setOtpPopup(true);
            setMessage('High value transfer! OTP sent — check backend terminal!');
            return;
        }
        executeTransfer(amount, toAccount);
    };
 
    const executeTransfer = async (amt, toAcc) => {
        setLoading(true);
        try {
            await bankingAPI.transfer({
                email: user.email,
                toAccountNumber: toAcc,
                amount: parseFloat(amt)
            });
            setMessage('Transfer successful!');
            setAmount('');
            setToAccount('');
            loadAccount();
        } catch {
            setMessage('Transfer failed! Check account number!');
        } finally {
            setLoading(false);
        }
    };
 
    const handleOtpVerify = async () => {
        try {
            const res = await axios.post(
                'http://localhost:8080/api/mfa/verify',
                { email: user.email, otp }
            );
            if (res.data === true) {
                setOtpPopup(false);
                setOtp('');
                executeTransfer(
                    pendingTransfer.amount,
                    pendingTransfer.toAccount
                );
            } else {
                setMessage('Invalid OTP! Transfer cancelled!');
                setOtpPopup(false);
            }
        } catch {
            setMessage('OTP verification failed!');
            setOtpPopup(false);
        }
    };
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.navLogo}>🤖FinGenie AI</h1>
                <div style={styles.navLinks}>
                    <button style={styles.navBtn}
                        onClick={() => navigate('/loans')}>
                        📝Loans
                    </button>
                    <button style={styles.navBtn}
                        onClick={() => navigate('/investments')}>
                        💹Investments
                    </button>
                    <button style={styles.navBtn}
                        onClick={() => navigate('/fraud')}>
                        ❗Fraud Alerts
                    </button>
                    <button style={styles.navBtn}
                        onClick={() => navigate('/chatbot')}>
                        💬AI Chat
                    </button>
                    {user?.role === 'ADMIN' && (
                        <button style={styles.navBtn}
                            onClick={() => navigate('/admin')}>
                            🧑‍💼Admin
                        </button>
                    )}
                    <button style={styles.logoutBtn}
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </nav>
 
            {otpPopup && (
                <div style={styles.otpOverlay}>
                    <div style={styles.otpCard}>
                        <h3>High Value Transfer OTP</h3>
                        <p style={{ color: '#666' }}>
                            Check backend terminal for OTP!
                        </p>
                        <input
                            style={styles.otpInput}
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={styles.verifyBtn}
                                onClick={handleOtpVerify}>
                               🔐 Verify OTP
                            </button>
                            <button style={styles.cancelBtn}
                                onClick={() => {
                                    setOtpPopup(false);
                                    setOtp('');
                                }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
 
            <div style={styles.content}>
                <h2 style={styles.welcome}>
                    ✨Welcome, {user?.fullName}!
                </h2>
 
                {account && (
                    <div style={styles.accountCard}>
                        <p style={styles.accountLabel}>
                            Account Number
                        </p>
                        <p style={styles.accountNumber}>
                            {account.accountNumber}
                        </p>
                        <p style={styles.balanceLabel}>
                            Available Balance
                        </p>
                        <p style={styles.balance}>
                            Rs.{account.balance?.toLocaleString()}
                        </p>
                    </div>
                )}
 
                <div style={styles.actionCard}>
                    <h3>Quick Actions</h3>
                    {message && (
                        <div style={styles.message}>{message}</div>
                    )}
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Recipient Account Number (for transfer only)"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                    />
                    <div style={styles.btnRow}>
                        <button style={styles.depositBtn}
                            onClick={handleDeposit}
                            disabled={loading}>
                            Deposit
                        </button>
                        <button style={styles.withdrawBtn}
                            onClick={handleWithdraw}
                            disabled={loading}>
                            Withdraw
                        </button>
                        <button style={styles.transferBtn}
                            onClick={handleTransfer}
                            disabled={loading}>
                            Transfer
                        </button>
                    </div>
                </div>
 
                <div style={styles.qrCard}>
                    <h3>📱QR Payment</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Show this QR code to receive payments
                    </p>
                    <button style={styles.qrBtn}
                        onClick={() => setShowQR(!showQR)}>
                        {showQR ? 'Hide QR Code' : 'Show QR Code'}
                    </button>
                    {showQR && account && (
                        <div style={styles.qrContainer}>
                            <QRCodeSVG
                                value={`fingenie://pay?account=${account.accountNumber}&name=${user?.fullName}`}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#667eea"
                                level="H"
                            />
                            <p style={styles.qrText}>
                                Account: {account.accountNumber}
                            </p>
                            <p style={styles.qrName}>
                                {user?.fullName}
                            </p>
                        </div>
                    )}
                </div>
 
                <div style={styles.txCard}>
                    <h3>Recent Transactions</h3>
                    {transactions.length === 0 ? (
                        <p style={{ color: '#666' }}>
                            No transactions yet
                        </p>
                    ) : (
                        transactions.slice(0, 10).map((tx) => (
                            <TransactionCard
                                key={tx.id}
                                transaction={tx}
                            />
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
    navLogo: { color: 'white', margin: 0 },
    navLinks: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    navBtn: {
        background: 'rgba(255,255,255,0.2)', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    logoutBtn: {
        background: '#ff4757', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    otpOverlay: {
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 1000,
    },
    otpCard: {
        background: 'white', padding: '32px',
        borderRadius: '16px', textAlign: 'center',
        width: '350px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    otpInput: {
        width: '100%', padding: '16px',
        borderRadius: '8px',
        border: '2px solid #667eea',
        fontSize: '24px', textAlign: 'center',
        letterSpacing: '8px', fontWeight: '700',
        boxSizing: 'border-box', marginBottom: '16px',
    },
    verifyBtn: {
        flex: 1, padding: '12px',
        background: '#667eea', color: 'white',
        border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: '600',
    },
    cancelBtn: {
        flex: 1, padding: '12px',
        background: '#ff4757', color: 'white',
        border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: '600',
    },
    content: {
        maxWidth: '800px', margin: '32px auto',
        padding: '0 16px'
    },
    welcome: { color: '#1a1a2e', marginBottom: '24px' },
    accountCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px', padding: '32px',
        color: 'white', marginBottom: '24px',
    },
    accountLabel: { margin: 0, opacity: 0.8, fontSize: '14px' },
    accountNumber: {
        fontSize: '20px', fontWeight: '600',
        margin: '4px 0 16px'
    },
    balanceLabel: { margin: 0, opacity: 0.8, fontSize: '14px' },
    balance: {
        fontSize: '36px', fontWeight: '700',
        margin: '4px 0 0'
    },
    actionCard: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    message: {
        background: '#e0ffe0', color: '#060',
        padding: '10px', borderRadius: '8px',
        marginBottom: '12px', textAlign: 'center',
    },
    input: {
        width: '100%', padding: '12px',
        borderRadius: '8px', border: '2px solid #e0e0e0',
        fontSize: '14px', boxSizing: 'border-box',
        marginBottom: '12px',
    },
    btnRow: { display: 'flex', gap: '12px' },
    depositBtn: {
        flex: 1, padding: '12px', background: '#2ed573',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '16px',
        cursor: 'pointer',
    },
    withdrawBtn: {
        flex: 1, padding: '12px', background: '#ff4757',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '16px',
        cursor: 'pointer',
    },
    transferBtn: {
        flex: 1, padding: '12px', background: '#1e90ff',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '16px',
        cursor: 'pointer',
    },
    qrCard: {
        background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
    },
    qrBtn: {
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', marginBottom: '16px',
    },
    qrContainer: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px',
        padding: '24px', background: '#f9f9f9',
        borderRadius: '12px', marginTop: '16px',
    },
    qrText: {
        margin: 0, color: '#666',
        fontSize: '14px', fontWeight: '600',
    },
    qrName: {
        margin: 0, color: '#667eea',
        fontSize: '16px', fontWeight: '700',
    },
    txCard: {
        background: 'white', borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
};
 
export default Dashboard;
 
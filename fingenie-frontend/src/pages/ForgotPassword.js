import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
 
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `http://localhost:8080/api/mfa/generate?email=${email}`
            );
            setStep(2);
            setMessage('OTP sent! Check backend terminal!');
        } catch {
            setError('Email not found!');
        } finally {
            setLoading(false);
        }
    };
 
    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const verified = await axios.post(
                'http://localhost:8080/api/mfa/verify',
                { email, otp }
            );
            if (verified.data === true) {
                await axios.post(
                    'http://localhost:8080/api/auth/reset-password',
                    { email, newPassword }
                );
                alert('Password reset successful!');
                navigate('/login');
            } else {
                setError('Invalid OTP!');
            }
        } catch {
            setError('Reset failed!');
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>FinGenie AI</h1>
 
                {step === 1 && (
                    <>
                        <h2 style={styles.title}>Forgot Password</h2>
                        <p style={styles.subtitle}>
                            Enter your email to reset password
                        </p>
                        {error && <div style={styles.error}>{error}</div>}
                        <form onSubmit={handleSendOtp}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button style={loading ?
                                styles.buttonDisabled : styles.button}
                                type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                        <button style={styles.backBtn}
                            onClick={() => navigate('/login')}>
                            Back to Login
                        </button>
                    </>
                )}
 
                {step === 2 && (
                    <>
                        <h2 style={styles.title}>Reset Password</h2>
                        {message && (
                            <div style={styles.info}>{message}</div>
                        )}
                        {error && <div style={styles.error}>{error}</div>}
                        <form onSubmit={handleReset}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Enter OTP
                                </label>
                                <input
                                    style={styles.otpInput}
                                    type="password"
                                    placeholder="Enter 6 digit OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    New Password
                                </label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e =>
                                        setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button style={loading ?
                                styles.buttonDisabled : styles.button}
                                type="submit" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                        <button style={styles.backBtn}
                            onClick={() => navigate('/login')}>
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
 
const styles = {
    container: {
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
        background: 'white', padding: '40px',
        borderRadius: '16px', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    logo: {
        textAlign: 'center', fontSize: '28px',
        marginBottom: '8px', color: '#667eea',
    },
    title: { textAlign: 'center', color: '#1a1a2e', marginBottom: '4px' },
    subtitle: { textAlign: 'center', color: '#666', marginBottom: '24px' },
    info: {
        background: '#e8f4fd', color: '#1a73e8',
        padding: '10px', borderRadius: '8px',
        marginBottom: '16px', textAlign: 'center',
    },
    error: {
        background: '#ffe0e0', color: '#c00',
        padding: '10px', borderRadius: '8px',
        marginBottom: '16px', textAlign: 'center',
    },
    inputGroup: { marginBottom: '16px' },
    label: {
        display: 'block', marginBottom: '6px',
        color: '#333', fontWeight: '600',
    },
    input: {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: '2px solid #e0e0e0', fontSize: '14px',
        boxSizing: 'border-box',
    },
    otpInput: {
        width: '100%', padding: '16px', borderRadius: '8px',
        border: '2px solid #667eea', fontSize: '24px',
        boxSizing: 'border-box', textAlign: 'center',
        letterSpacing: '8px', fontWeight: '700',
    },
    button: {
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', fontWeight: '600',
        cursor: 'pointer', marginTop: '8px',
    },
    buttonDisabled: {
        width: '100%', padding: '14px',
        background: '#ccc', color: 'white',
        border: 'none', borderRadius: '8px',
        fontSize: '16px', cursor: 'not-allowed', marginTop: '8px',
    },
    backBtn: {
        width: '100%', padding: '12px',
        background: 'transparent', color: '#667eea',
        border: '2px solid #667eea', borderRadius: '8px',
        fontSize: '14px', cursor: 'pointer', marginTop: '12px',
    },
};
 
export default ForgotPassword;
 
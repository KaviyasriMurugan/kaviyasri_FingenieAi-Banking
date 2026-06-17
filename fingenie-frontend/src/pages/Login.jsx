import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [step, setStep] = useState(1);
    const [otpValue, setOtpValue] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(email, password);
 
            if (isAdminLogin && userData.role !== 'ADMIN') {
                setError('You are not authorized as Admin!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
                return;
            }
 
           if (!isAdminLogin && userData.role === 'ADMIN') {
                setError('Please use Admin Login button!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
                return;
            }
 
            await axios.post(
                `http://localhost:8080/api/mfa/generate?email=${email}`
            );
            setStep(2);
 
        } catch (err) {
            setError('Invalid email or password!');
        } finally {
            setLoading(false);
        }
    };
 
    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                'http://localhost:8080/api/mfa/verify',
                { email, otp: otpValue }
            );
            if (res.data === true) {
                const userData = JSON.parse(
                    localStorage.getItem('user'));
                if (userData?.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid OTP! Try again!');
            }
        } catch {
            setError('OTP verification failed!');
        } finally {
            setLoading(false);
        }
    };
 
    if (step === 2) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.logo}>FinGenie AI</h1>
                    <h2 style={styles.title}>
                        Two Factor Authentication
                    </h2>
                    <p style={styles.subtitle}>
                        Enter the OTP from backend terminal
                    </p>
                    <div style={styles.otpInfo}>
                        Check backend terminal for OTP number!
                    </div>
                    {error && (
                        <div style={styles.error}>{error}</div>
                    )}
                    <form onSubmit={handleOtpVerify}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                Enter OTP
                            </label>
                            <input
                                style={styles.otpInput}
                                type="password"
                                placeholder="000000"
                                value={otpValue}
                                onChange={e =>
                                    setOtpValue(e.target.value)}
                                maxLength={6}
                                required
                                autoFocus
                            />
                        </div>
                        <button
                            style={loading ?
                                styles.buttonDisabled : styles.button}
                            type="submit"
                            disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                    <button
                        style={styles.switchBtn}
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setOtpValue('');
                            setError('');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                        }}>
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }
 
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}> 🤖FinGenie AI</h1>
 
                {isAdminLogin && (
                    <div></div>
                )}
 
                <h2 style={styles.title}>
                    {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
                </h2>
                <p style={styles.subtitle}>
                    {isAdminLogin
                        ? 'Sign in with admin credentials'
                        : 'Sign in to your account'}
                </p>
 
                {error && <div style={styles.error}>{error}</div>}
 
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={isAdminLogin ?
                                styles.adminInput : styles.input}
                            type="email"
                            placeholder={isAdminLogin ?
                                'Enter admin email' :
                                'Enter your email'}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={isAdminLogin ?
                                styles.adminInput : styles.input}
                            type="password"
                            placeholder={isAdminLogin ?
                                'Enter admin password' :
                                'Enter your password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        style={loading ? styles.buttonDisabled :
                            isAdminLogin ? styles.adminButton :
                            styles.button}
                        type="submit"
                        disabled={loading}>
                        {loading ? 'Signing in...' :
                            isAdminLogin ? 'Admin Sign In' : 'Sign In'}
                    </button>
                </form>
 
                {!isAdminLogin && (
                    <>
                        <p style={styles.forgotText}>
                            <Link to="/forgot-password"
                                style={styles.link}>
                                Forgot Password?
                            </Link>
                        </p>
                        <p style={styles.registerText}>
                            Don't have an account?{' '}
                            <Link to="/register" style={styles.link}>
                                Register here
                            </Link>
                        </p>
                    </>
                )}
 
                <div style={styles.divider}>OR</div>
 
                <button
                    style={isAdminLogin ?
                        styles.switchBtn : styles.adminBtn}
                    onClick={() => {
                        setIsAdminLogin(!isAdminLogin);
                        setEmail('');
                        setPassword('');
                        setError('');
                    }}>
                    {isAdminLogin ?
                        'Back to User Login' : 'Login as Admin'}
                </button>
            </div>
        </div>
    );
};
 
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    logo: {
        textAlign: 'center',
        fontSize: '28px',
        marginBottom: '8px',
        color: '#667eea',
    },

    title: {
        textAlign: 'center',
        color: '#1a1a2e',
        marginBottom: '4px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '24px',
    },
    otpInfo: {
        background: '#e8f4fd',
        color: '#1a73e8',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
    },
    error: {
        background: '#ffe0e0',
        color: '#c00',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
    },
    inputGroup: { marginBottom: '16px' },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#333',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    adminInput: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid #797579',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    otpInput: {
        width: '100%',
        padding: '16px',
        borderRadius: '8px',
        border: '2px solid #667eea',
        fontSize: '24px',
        boxSizing: 'border-box',
        textAlign: 'center',
        letterSpacing: '8px',
        fontWeight: '700',
        marginBottom: '16px',
        outline: 'none',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 
color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    adminButton: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
        adminBadge: {
        background: '#764ba2',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '12px',
        marginBottom: '12px',
    },
    buttonDisabled: {
        width: '100%',
        padding: '14px',
        background: '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'not-allowed',
        marginTop: '8px',
    },
    forgotText: {
        textAlign: 'center',
        marginTop: '12px',
        color: '#666',
    },
    registerText: {
        textAlign: 'center',
        marginTop: '8px',
        color: '#666',
    },
    link: {
        color: '#667eea',
        fontWeight: '600',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    divider: {
        textAlign: 'center',
        margin: '16px 0',
        color: '#999',
        fontSize: '14px',
    },
    adminBtn: {
        width: '100%',
        padding: '12px',
        background: '#764ba2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    switchBtn: {
        width: '100%',
        padding: '12px',
        background: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        marginTop: '12px',
    },
};
 
export default Login;
 
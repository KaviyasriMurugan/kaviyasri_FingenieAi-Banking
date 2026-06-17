import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(formData.email, formData.password, formData.fullName);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Email may already exist!');
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}> FinGenie AI</h1>
                <h2 style={styles.title}>Create Account</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    {['fullName', 'email', 'password', 'confirmPassword'].map((field) => (
                        <div style={styles.inputGroup} key={field}>
                            <label style={styles.label}>
                                {field === 'fullName' ? 'Full Name' :
                                 field === 'confirmPassword' ? 'Confirm Password' :
                                 field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                style={styles.input}
                                type={field.includes('password') || field.includes('Password') ? 'password' : field === 'email' ? 'email' : 'text'}
                                name={field}
                                placeholder={`Enter your ${field}`}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <button style={loading ? styles.buttonDisabled : styles.button}
                        type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};
 
const styles = {
    container: {
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
        background: 'white', padding: '40px', borderRadius: '16px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    logo: { textAlign: 'center', fontSize: '32px', marginBottom: '8px' },
    title: { textAlign: 'center', color: '#1a1a2e', marginBottom: '16px' },
    error: {
        background: '#ffe0e0', color: '#c00', padding: '10px',
        borderRadius: '8px', marginBottom: '16px', textAlign: 'center',
    },
    inputGroup: { marginBottom: '14px' },
    label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '600' },
    input: {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: '2px solid #e0e0e0', fontSize: '14px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
    },
    buttonDisabled: {
        width: '100%', padding: '14px', background: '#ccc',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', cursor: 'not-allowed', marginTop: '8px',
    },
    loginText: { textAlign: 'center', marginTop: '20px', color: '#666' },
    link: { color: '#667eea', fontWeight: '600', textDecoration: 'none' },
};
 
export default Register;
 
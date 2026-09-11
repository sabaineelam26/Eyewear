import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import './Admin.css'; // Will fallback to normal auth css if not fully isolated, but let's use isolated

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { loginAdmin, admin } = useContext(AdminAuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (admin && admin.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [admin, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        const res = await loginAdmin(email, password);
        if (!res.success) {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>Eyewear Admin Portal</h1>
                
                {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                
                <form onSubmit={submitHandler}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: '#1f2937', borderColor: '#1f2937' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

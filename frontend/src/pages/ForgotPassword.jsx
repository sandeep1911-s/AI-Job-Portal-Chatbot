import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await API.post('/auth/reset-password', { email, newPassword });
            setSuccess(res.data.message || 'Password has been reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'url(/src/assets/ai_career_bg.png) no-repeat center center/cover',
            position: 'relative',
        }}>
            {/* Dark overlay for better readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 17, 32, 0.75)' }} />

            <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: 460, width: '100%' }}>
                <div className="card-static animate-in" style={{ 
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.15)',
                    borderRadius: '24px',
                    padding: '40px 32px'
                }}>
                    <Link to="/login" style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 6, 
                        color: '#94a3b8', textDecoration: 'none', fontSize: 13, 
                        marginBottom: 24, fontWeight: 500, transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>

                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.15))', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                            <ShieldCheck size={32} color="#34d399" />
                        </div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>Reset Password</h1>
                        <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 6, lineHeight: 1.5 }}>Enter your account email and your new desired password.</p>
                    </div>

                    {error && <div className="alert alert-error" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(4px)', color: '#f87171' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(4px)', color: '#34d399' }}>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="label" style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input className="input" type="email" placeholder="you@example.com"
                                    style={{ 
                                        paddingLeft: 44, 
                                        height: 48, 
                                        background: 'rgba(11, 17, 32, 0.7)', 
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#34d399'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)'; e.target.style.background = 'rgba(15, 23, 42, 0.9)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(11, 17, 32, 0.7)'; }}
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 32 }}>
                            <label className="label" style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                                    style={{ 
                                        paddingLeft: 44, paddingRight: 44, 
                                        height: 48, 
                                        background: 'rgba(11, 17, 32, 0.7)', 
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#34d399'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)'; e.target.style.background = 'rgba(15, 23, 42, 0.9)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(11, 17, 32, 0.7)'; }}
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                                    onMouseLeave={(e) => e.target.style.color = '#64748b'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg" type="submit" disabled={loading || success}
                            style={{ 
                                width: '100%', 
                                height: 50, 
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                border: 'none',
                                transition: 'all 0.3s ease',
                                opacity: loading || success ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => { if (!loading && !success) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)'; } }}
                            onMouseLeave={(e) => { if (!loading && !success) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; } }}
                        >
                            {loading ? 'Updating Password...' : success ? 'Success!' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Theme colours (purple-indigo-cyan)
const T = {
    accent: '#818cf8',
    accentAlt: '#06b6d4',
    btnFrom: '#6366f1',
    btnTo: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.25)',
    glowShadow: '0 0 40px rgba(99, 102, 241, 0.18)',
    inputBg: 'rgba(15, 10, 40, 0.7)',
    inputBgFocus: 'rgba(20, 14, 55, 0.9)',
    cardBg: 'rgba(13, 8, 36, 0.70)',
    border: 'rgba(129, 140, 248, 0.15)',
    iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(6,182,212,0.14))',
    iconBorder: 'rgba(129,140,248,0.3)',
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        height: 48, paddingLeft: 44, paddingRight: 16,
        background: T.inputBg,
        border: `1px solid ${T.border}`,
        color: '#f8fafc', borderRadius: '12px',
        transition: 'all 0.3s ease', width: '100%',
    };
    const onFocus = (e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.glow}`; e.target.style.background = T.inputBgFocus; };
    const onBlur = (e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; e.target.style.background = T.inputBg; };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'url(/src/assets/ai_career_bg.png) no-repeat center center/cover',
            position: 'relative',
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8, 4, 28, 0.80)' }} />

            <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: 440, width: '100%' }}>
                {/* Error Modal */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setError('')}>
                            <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'linear-gradient(145deg, #130f2a, #1e1640)',
                                    borderRadius: 20, padding: '36px 30px 28px', width: '90%', maxWidth: 370,
                                    textAlign: 'center',
                                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.12)',
                                    border: '1px solid rgba(129,140,248,0.12)', position: 'relative',
                                }}>
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 3, borderRadius: '0 0 4px 4px', background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
                                <div style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(239,68,68,0.2)' }}>
                                    <AlertCircle size={30} color="#f87171" />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>Login Failed</h3>
                                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>{error}</p>
                                <button onClick={() => setError('')} style={{ width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 600, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}>OK</button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Card */}
                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}
                    style={{
                        width: '100%', background: T.cardBg,
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        border: `1px solid ${T.border}`,
                        boxShadow: `0 28px 56px rgba(0,0,0,0.55), ${T.glowShadow}`,
                        borderRadius: 26, padding: '44px 36px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                    {/* Top gradient bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #6366f1, #818cf8, #06b6d4)', borderRadius: '26px 26px 0 0' }} />

                    {/* Decorative orb */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)', pointerEvents: 'none' }} />

                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ width: 68, height: 68, borderRadius: 22, margin: '0 auto 20px', background: T.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(99,102,241,0.22)', border: `1px solid ${T.iconBorder}` }}>
                            <LogIn size={32} color={T.accent} />
                        </div>
                        <h1 style={{ fontSize: 27, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #e0e7ff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h1>
                        <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 6 }}>Sign in to continue your AI journey</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="label" style={{ color: '#a5b4fc', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input className="input" type="email" placeholder="you@example.com"
                                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group" style={{ marginBottom: 10 }}>
                            <label className="label" style={{ color: '#a5b4fc', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                    style={{ ...inputStyle, paddingRight: 48 }}
                                    onFocus={onFocus} onBlur={onBlur}
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div style={{ textAlign: 'right', marginBottom: 24 }}>
                            <Link to="/forgot-password" style={{ color: T.accent, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</Link>
                        </div>

                        {/* Submit */}
                        <button className="btn btn-lg" type="submit" disabled={loading}
                            style={{
                                width: '100%', height: 52, borderRadius: 14,
                                background: `linear-gradient(135deg, ${T.btnFrom}, ${T.btnTo})`,
                                boxShadow: '0 4px 18px rgba(99,102,241,0.4)',
                                fontSize: 16, fontWeight: 700, color: '#fff',
                                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                letterSpacing: '0.4px', transition: 'all 0.3s ease',
                                opacity: loading ? 0.8 : 1,
                            }}
                            onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; } }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 18px rgba(99,102,241,0.4)'; }}>
                            {loading ? 'Signing In...' : 'Sign In →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 26, fontSize: 14, color: '#64748b' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: T.accent, textDecoration: 'none', fontWeight: 700 }}>Register here</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

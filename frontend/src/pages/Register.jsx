import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Briefcase, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// Theme colours (purple-indigo-cyan — matches Login)
const T = {
    accent: '#818cf8',
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

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
    const [idProof, setIdProof] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let data = form;
            let headers = {};

            if (form.role === 'provider') {
                if (!idProof) {
                    setError('ID Proof is required for Job Providers.');
                    setLoading(false);
                    return;
                }
                const formData = new FormData();
                formData.append('username', form.username);
                formData.append('email', form.email);
                formData.append('password', form.password);
                formData.append('role', form.role);
                formData.append('id_proof', idProof);
                data = formData;
                headers = { 'Content-Type': 'multipart/form-data' };
            }

            const res = await API.post('/auth/register', data, { headers });
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'user', label: 'Job Seeker', icon: Users, desc: 'Find jobs, build CV, grow skills' },
        { value: 'provider', label: 'Job Provider', icon: Briefcase, desc: 'Post jobs, hire talent' },
    ];

    const inputStyle = {
        height: 48, paddingLeft: 44, paddingRight: 16,
        background: T.inputBg, border: `1px solid ${T.border}`,
        color: '#f8fafc', borderRadius: '12px',
        transition: 'all 0.3s ease', width: '100%',
    };
    const onFocus = (e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.glow}`; e.target.style.background = T.inputBgFocus; };
    const onBlur = (e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; e.target.style.background = T.inputBg; };
    const labelStyle = { color: '#a5b4fc', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'url(/src/assets/ai_career_bg.png) no-repeat center center/cover',
            position: 'relative',
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8, 4, 28, 0.80)' }} />

            <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: 490, width: '100%', paddingTop: 32, paddingBottom: 32 }}>
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
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #06b6d4, #818cf8, #6366f1)', borderRadius: '26px 26px 0 0' }} />

                    {/* Decorative orb */}
                    <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', pointerEvents: 'none' }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{ width: 68, height: 68, borderRadius: 22, margin: '0 auto 18px', background: T.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(99,102,241,0.22)', border: `1px solid ${T.iconBorder}` }}>
                            <UserPlus size={32} color={T.accent} />
                        </div>
                        <h1 style={{ fontSize: 27, fontWeight: 800, background: 'linear-gradient(135deg, #e0e7ff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                            Create Account
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 6 }}>Join the AI-powered career platform</p>
                    </div>

                    {error && (
                        <div className="alert alert-error" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', backdropFilter: 'blur(4px)', color: '#f87171', marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/* Role Selection */}
                        <div className="form-group" style={{ marginBottom: 22 }}>
                            <label className="label" style={{ ...labelStyle, display: 'block' }}>I am a</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {roles.map(r => {
                                    const Icon = r.icon;
                                    const active = form.role === r.value;
                                    return (
                                        <div key={r.value}
                                            onClick={() => setForm({ ...form, role: r.value })}
                                            style={{
                                                padding: '14px 12px', borderRadius: 14, cursor: 'pointer',
                                                border: `2px solid ${active ? T.accent : 'rgba(129,140,248,0.12)'}`,
                                                background: active ? 'rgba(99,102,241,0.12)' : 'rgba(15,10,40,0.5)',
                                                textAlign: 'center', transition: 'all 0.3s ease',
                                                boxShadow: active ? `0 0 22px rgba(99,102,241,0.18)` : 'none',
                                            }}
                                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(15,10,40,0.8)'; }}
                                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'rgba(15,10,40,0.5)'; }}
                                        >
                                            <Icon size={26} color={active ? T.accent : '#64748b'} style={{ margin: '0 auto 8px', display: 'block' }} />
                                            <div style={{ fontWeight: 700, fontSize: 14, color: active ? T.accent : '#e2e8f0' }}>{r.label}</div>
                                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{r.desc}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Username */}
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="label" style={{ ...labelStyle, display: 'block' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input className="input" type="text" placeholder="johndoe"
                                    style={inputStyle}
                                    autoComplete="nope" readOnly
                                    onFocus={(e) => { e.target.removeAttribute('readOnly'); onFocus(e); }}
                                    onBlur={onBlur}
                                    value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="label" style={{ ...labelStyle, display: 'block' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input className="input" type="email" placeholder="you@example.com"
                                    style={{ ...inputStyle, border: emailError ? '1px solid rgba(239,68,68,0.5)' : `1px solid ${T.border}` }}
                                    autoComplete="nope" readOnly
                                    onFocus={(e) => { e.target.removeAttribute('readOnly'); onFocus(e); }}
                                    onBlur={(e) => { e.target.style.borderColor = emailError ? 'rgba(239,68,68,0.5)' : T.border; e.target.style.boxShadow = 'none'; e.target.style.background = T.inputBg; }}
                                    value={form.email}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setForm({ ...form, email: val });
                                        e.target.setCustomValidity('');
                                        setEmailError(val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Enter a valid email' : '');
                                    }}
                                    required />
                            </div>
                            {emailError && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5, fontWeight: 500 }}>{emailError}</p>}
                        </div>

                        {/* Password */}
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="label" style={{ ...labelStyle, display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                                    style={{ ...inputStyle, paddingRight: 48 }}
                                    onFocus={onFocus} onBlur={onBlur}
                                    autoComplete="new-password"
                                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* ID Proof (Providers only) */}
                        {form.role === 'provider' && (
                            <div className="form-group" style={{ marginBottom: 20 }}>
                                <label className="label" style={{ ...labelStyle, display: 'block' }}>ID Proof (PDF/Image)</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                    <input className="input" type="file" accept="image/*,.pdf"
                                        style={{ ...inputStyle, padding: '10px 16px 10px 44px' }}
                                        onChange={(e) => setIdProof(e.target.files[0])} required />
                                </div>
                                <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Required to verify your business identity.</p>
                            </div>
                        )}

                        {/* Provider warning */}
                        {form.role === 'provider' && (
                            <div className="alert alert-warning" style={{ marginBottom: 20, background: 'rgba(245,158,11,0.12)', backdropFilter: 'blur(4px)', borderColor: 'rgba(245,158,11,0.3)', color: '#fcd34d', fontSize: 13 }}>
                                ⚠️ Provider accounts require admin approval before posting jobs.
                            </div>
                        )}

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
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: T.accent, textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

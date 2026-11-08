import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { motion } from 'framer-motion';
import {
    FileText, Briefcase, Send, Lightbulb, TrendingUp,
    MessageSquare, ArrowRight, CheckCircle, XCircle,
    Clock, Star, Zap, BarChart2, Target
} from 'lucide-react';
import FeedbackSection from '../../components/FeedbackSection';

function StatRing({ value, max, color, size = 80 }) {
    const radius = (size - 10) / 2;
    const circ = 2 * Math.PI * radius;
    const progress = max > 0 ? Math.min(value / max, 1) : 0;
    const dash = circ * progress;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
    );
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ hasCV: false, applicationCount: 0, pending: 0, accepted: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [cvRes, appRes] = await Promise.allSettled([
                    API.get('/cv'),
                    API.get('/applications/my'),
                ]);
                const hasCV = cvRes.status === 'fulfilled' && cvRes.value.data?.id;
                const apps = appRes.status === 'fulfilled' ? appRes.value.data : [];
                setStats({
                    hasCV,
                    applicationCount: apps.length,
                    pending: apps.filter(a => a.status === 'pending').length,
                    accepted: apps.filter(a => a.status === 'accepted').length,
                    rejected: apps.filter(a => a.status === 'rejected').length,
                });
            } catch (e) { } finally { setLoading(false); }
        }
        fetchData();
    }, []);

    const quickActions = [
        { path: '/cv-builder', icon: FileText, label: 'Build Your CV', color: '#818cf8', desc: 'Create or update your CV with AI-powered summaries', badge: 'AI' },
        { path: '/browse-jobs', icon: Briefcase, label: 'Browse Jobs', color: '#22d3ee', desc: 'Browse and apply to the latest openings' },
        { path: '/job-suggestions', icon: Lightbulb, label: 'AI Job Match', color: '#34d399', desc: 'Get personalised AI-powered job recommendations', badge: 'New' },
        { path: '/skill-suggestions', icon: TrendingUp, label: 'Skill Growth', color: '#fbbf24', desc: 'Discover future-proof skills for your career' },
        { path: '/my-applications', icon: Send, label: 'My Applications', color: '#f87171', desc: 'Track the status of all your applications' },
        { path: '/chat', icon: MessageSquare, label: 'AI Career Chat', color: '#c084fc', desc: 'Get instant career advice from our AI counselor', badge: 'AI' },
    ];

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const successRate = stats.applicationCount > 0
        ? Math.round((stats.accepted / stats.applicationCount) * 100)
        : 0;

    return (
        <div className="page-container">
            {/* ─── Hero Banner ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(14,165,233,0.1) 50%, rgba(129,140,248,0.1) 100%)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 24,
                    padding: '32px 36px',
                    marginBottom: 32,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative glow orb */}
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                        background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
                    }}>
                        <Zap size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: 4 }}>
                            Welcome back, {user?.username} 👋
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 15 }}>
                            Here's what's happening with your career journey today.
                        </p>
                    </div>
                    <Link to="/chat" className="btn btn-primary" style={{
                        marginLeft: 'auto',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                        borderRadius: 12,
                    }}>
                        <MessageSquare size={16} /> Ask AI
                    </Link>
                </div>
            </motion.div>

            {/* ─── Stats Row ───────────────────────────────────── */}
            <div className="grid-4" style={{ marginBottom: 36 }}>
                {[
                    {
                        label: 'CV Status', value: stats.hasCV ? 'Ready' : 'Missing',
                        icon: stats.hasCV ? CheckCircle : XCircle,
                        color: stats.hasCV ? '#4ade80' : '#f87171',
                        sub: stats.hasCV ? 'Your CV is live' : 'Create your CV',
                        delay: 0,
                    },
                    {
                        label: 'Applications', value: stats.applicationCount,
                        icon: Send, color: '#818cf8',
                        sub: 'Total submitted',
                        delay: 0.08,
                        ring: { value: stats.applicationCount, max: Math.max(stats.applicationCount, 10), color: '#818cf8' },
                    },
                    {
                        label: 'Pending', value: stats.pending,
                        icon: Clock, color: '#fbbf24',
                        sub: 'Awaiting response',
                        delay: 0.16,
                        ring: { value: stats.pending, max: Math.max(stats.applicationCount, 1), color: '#fbbf24' },
                    },
                    {
                        label: 'Success Rate', value: `${successRate}%`,
                        icon: Star, color: '#34d399',
                        sub: `${stats.accepted} accepted`,
                        delay: 0.24,
                        ring: { value: successRate, max: 100, color: '#34d399' },
                    },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} className="stat-card"
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: s.delay, duration: 0.4 }}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {/* background icon watermark */}
                            <Icon size={80} color={s.color} style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05 }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: `${s.color}18`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={20} color={s.color} />
                                </div>
                                {s.ring && <StatRing {...s.ring} size={44} />}
                            </div>

                            <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1.1, marginBottom: 4 }}>
                                {s.value}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9', marginBottom: 2 }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{s.sub}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── Quick Actions ───────────────────────────────── */}
            <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Target size={20} color="#34d399" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quick Actions</h2>
                </div>
                <div className="grid-3">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 + i * 0.08 }}
                            >
                                <Link to={action.path} className="card" style={{
                                    display: 'block', textDecoration: 'none', color: 'inherit',
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    {action.badge && (
                                        <span style={{
                                            position: 'absolute', top: 12, right: 12,
                                            background: action.badge === 'AI' ? 'linear-gradient(135deg,#10b981,#0ea5e9)' : 'linear-gradient(135deg,#f59e0b,#ef4444)',
                                            color: 'white', fontSize: 10, fontWeight: 800,
                                            padding: '2px 8px', borderRadius: 20, letterSpacing: '0.5px',
                                        }}>{action.badge}</span>
                                    )}
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                                        background: `${action.color}15`, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${action.color}22`,
                                        boxShadow: `0 4px 12px ${action.color}15`,
                                    }}>
                                        <Icon size={24} color={action.color} />
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#f1f5f9' }}>{action.label}</div>
                                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>{action.desc}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: action.color, fontSize: 13, fontWeight: 600 }}>
                                        Open <ArrowRight size={14} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <FeedbackSection />
        </div>
    );
}

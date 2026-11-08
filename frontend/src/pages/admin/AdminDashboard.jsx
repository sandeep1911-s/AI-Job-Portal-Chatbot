import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { motion } from 'framer-motion';
import {
    Shield, Users, Building2, Briefcase, AlertCircle,
    Star, ClipboardList, TrendingUp, UserCheck,
    ArrowRight, Activity, CheckCircle, Zap
} from 'lucide-react';

function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginTop: 10 }}>
            <div style={{
                height: '100%', width: `${pct}%`, background: color,
                borderRadius: 6, transition: 'width 1s ease',
                boxShadow: `0 0 6px ${color}60`,
            }} />
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await API.get('/admin/stats');
                setStats(res.data);
            } catch (e) { } finally { setLoading(false); }
        }
        fetchStats();
    }, []);

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const statCards = [
        {
            label: 'Total Users', value: stats?.totalUsers || 0,
            icon: Users, color: '#818cf8',
            sub: 'Registered job seekers',
            barMax: Math.max(stats?.totalUsers || 0, 10),
            delay: 0,
        },
        {
            label: 'Providers', value: stats?.totalProviders || 0,
            icon: Building2, color: '#34d399',
            sub: `${stats?.pendingProviders || 0} awaiting approval`,
            barMax: Math.max(stats?.totalUsers || 0, 1),
            delay: 0.07,
        },
        {
            label: 'Pending Approvals', value: stats?.pendingProviders || 0,
            icon: Shield, color: '#fbbf24',
            sub: 'Providers need review',
            barMax: Math.max(stats?.totalProviders || 0, 1),
            delay: 0.14,
            urgent: (stats?.pendingProviders || 0) > 0,
        },
        {
            label: 'Total Jobs', value: stats?.totalJobs || 0,
            icon: Briefcase, color: '#22d3ee',
            sub: `${stats?.activeJobs || 0} active right now`,
            barMax: Math.max(stats?.totalJobs || 0, 10),
            delay: 0.21,
        },
        {
            label: 'Active Jobs', value: stats?.activeJobs || 0,
            icon: CheckCircle, color: '#4ade80',
            sub: 'Currently live listings',
            barMax: Math.max(stats?.totalJobs || 0, 1),
            delay: 0.28,
        },
        {
            label: 'Applications', value: stats?.totalApplications || 0,
            icon: ClipboardList, color: '#c084fc',
            sub: 'All-time submissions',
            barMax: Math.max(stats?.totalApplications || 0, 10),
            delay: 0.35,
        },
        {
            label: 'Open Complaints', value: stats?.openComplaints || 0,
            icon: AlertCircle, color: '#f87171',
            sub: 'Require your attention',
            barMax: Math.max(stats?.openComplaints || 0, 10),
            delay: 0.42,
            urgent: (stats?.openComplaints || 0) > 0,
        },
    ];

    const quickLinks = [
        { path: '/manage-providers', icon: UserCheck, label: 'Manage Providers', color: '#34d399', desc: 'Approve or reject provider accounts' },
        { path: '/active-users', icon: Users, label: 'Active Users', color: '#818cf8', desc: 'View and manage all platform users' },
        { path: '/view-feedback', icon: Star, label: 'View Feedback', color: '#fbbf24', desc: 'Read user satisfaction ratings' },
        { path: '/manage-complaints', icon: AlertCircle, label: 'Complaints', color: '#f87171', desc: 'Resolve open support tickets' },
    ];

    return (
        <div className="page-container">
            {/* ─── Hero Banner ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(129,140,248,0.10) 50%, rgba(16,185,129,0.10) 100%)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 24,
                    padding: '32px 36px',
                    marginBottom: 32,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative glow orbs */}
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(239,68,68,0.12), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -40, left: '40%', width: 180, height: 180, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.08), transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 18, flexShrink: 0,
                        background: 'linear-gradient(135deg, #ef4444, #818cf8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(239,68,68,0.35)',
                    }}>
                        <Shield size={30} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: 4 }}>
                            Admin Control Center
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 15 }}>
                            Welcome back, <strong style={{ color: '#f1f5f9' }}>{user?.username}</strong> — full platform overview below.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                        {(stats?.pendingProviders || 0) > 0 && (
                            <Link to="/manage-providers" className="btn btn-primary" style={{
                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
                                borderRadius: 12,
                                color: '#1a0000',
                                fontWeight: 700,
                            }}>
                                ⚠ {stats.pendingProviders} Pending
                            </Link>
                        )}
                        <Link to="/manage-complaints" className="btn btn-secondary" style={{ borderRadius: 12 }}>
                            <Activity size={15} /> Activity
                        </Link>
                    </div>
                </div>

                {/* Platform health strip */}
                <div style={{
                    marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap',
                    paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', zIndex: 1,
                }}>
                    {[
                        { label: 'Total Accounts', value: (stats?.totalUsers || 0) + (stats?.totalProviders || 0), icon: Users, color: '#818cf8' },
                        { label: 'Platform Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: '#22d3ee' },
                        { label: 'Applications', value: stats?.totalApplications || 0, icon: ClipboardList, color: '#c084fc' },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, background: `${item.color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={16} color={item.color} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{item.label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ─── Stat Cards Grid ─────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <TrendingUp size={18} color="#818cf8" />
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Platform Metrics</h2>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 36,
            }}>
                {statCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={i} className="stat-card"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: card.delay, duration: 0.4 }}
                            style={{
                                position: 'relative', overflow: 'hidden',
                                ...(card.urgent ? { borderColor: `${card.color}40`, boxShadow: `0 0 20px ${card.color}15` } : {}),
                            }}
                        >
                            {/* Watermark icon */}
                            <Icon size={80} color={card.color} style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05 }} />

                            {card.urgent && (
                                <div style={{
                                    position: 'absolute', top: 10, right: 12,
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: card.color,
                                    boxShadow: `0 0 8px ${card.color}`,
                                    animation: 'pulse 2s ease infinite',
                                }} />
                            )}

                            <div style={{
                                width: 38, height: 38, borderRadius: 10, marginBottom: 12,
                                background: `${card.color}16`, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${card.color}22`,
                            }}>
                                <Icon size={19} color={card.color} />
                            </div>

                            <div style={{ fontSize: 30, fontWeight: 800, color: card.color, lineHeight: 1, marginBottom: 3 }}>
                                {card.value}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#f1f5f9', marginBottom: 2 }}>{card.label}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{card.sub}</div>
                            <MiniBar value={card.value} max={card.barMax} color={card.color} />
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── Quick Actions ───────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Zap size={18} color="#f87171" />
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Management Actions</h2>
            </div>
            <div className="grid-4">
                {quickLinks.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                        >
                            <Link to={action.path} className="card" style={{
                                display: 'block', textDecoration: 'none', color: 'inherit',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                                    background: `${action.color}14`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${action.color}22`,
                                    boxShadow: `0 4px 12px ${action.color}12`,
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
    );
}

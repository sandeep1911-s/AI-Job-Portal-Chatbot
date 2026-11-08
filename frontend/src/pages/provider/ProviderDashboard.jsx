import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { motion } from 'framer-motion';
import {
    Building2, PlusCircle, ClipboardList, Users,
    ArrowRight, AlertTriangle, Briefcase, CheckCircle,
    TrendingUp, Zap, BarChart2, Eye
} from 'lucide-react';
import FeedbackSection from '../../components/FeedbackSection';

function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
            <div style={{
                height: '100%', width: `${pct}%`, background: color,
                borderRadius: 6, transition: 'width 1s ease',
                boxShadow: `0 0 8px ${color}60`,
            }} />
        </div>
    );
}

export default function ProviderDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobCount: 0, totalApps: 0, activeJobs: 0, pendingApps: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const jobsRes = await API.get('/jobs/my');
                const jobs = jobsRes.data;
                let totalApps = 0;
                let pendingApps = 0;
                for (const job of jobs) {
                    try {
                        const appRes = await API.get(`/applications/job/${job.id}`);
                        totalApps += appRes.data.length;
                        pendingApps += appRes.data.filter(a => a.status === 'pending').length;
                    } catch (e) { }
                }
                setStats({
                    jobCount: jobs.length,
                    activeJobs: jobs.filter(j => j.is_active).length,
                    totalApps,
                    pendingApps,
                });
            } catch (e) { } finally { setLoading(false); }
        }
        fetchData();
    }, []);

    if (!user?.is_approved) {
        return (
            <div className="page-container" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                        padding: 48, borderRadius: 24,
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        maxWidth: 460,
                    }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                        background: 'rgba(245,158,11,0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(245,158,11,0.2)',
                    }}>
                        <AlertTriangle size={40} color="#fbbf24" />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#f1f5f9' }}>Account Pending Approval</h1>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                        Your job provider account is awaiting admin review. You'll gain full access once approved.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const quickActions = [
        { path: '/post-job', icon: PlusCircle, label: 'Post a New Job', color: '#34d399', desc: 'Create a new job listing to attract candidates' },
        { path: '/my-jobs', icon: Building2, label: 'Manage My Jobs', color: '#818cf8', desc: 'Edit, activate, or deactivate your job posts' },
        { path: '/manage-applications', icon: ClipboardList, label: 'Review Applications', color: '#fbbf24', desc: 'Accept or reject incoming candidate applications' },
        { path: '/admin-messages', icon: Eye, label: 'Admin Messages', color: '#22d3ee', desc: 'View messages and updates from the platform admin' },
    ];

    return (
        <div className="page-container">
            {/* ─── Hero Banner ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(129,140,248,0.15) 0%, rgba(16,185,129,0.1) 60%, rgba(14,165,233,0.1) 100%)',
                    border: '1px solid rgba(129,140,248,0.2)',
                    borderRadius: 24,
                    padding: '32px 36px',
                    marginBottom: 32,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                        background: 'linear-gradient(135deg, #818cf8, #10b981)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(129,140,248,0.35)',
                    }}>
                        <Building2 size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: 4 }}>
                            Welcome, {user?.username} 🏢
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 15 }}>
                            Manage your job postings and review candidate applications.
                        </p>
                    </div>
                    <Link to="/post-job" className="btn btn-primary" style={{
                        marginLeft: 'auto',
                        background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                        boxShadow: '0 4px 15px rgba(129,140,248,0.3)',
                        borderRadius: 12,
                    }}>
                        <PlusCircle size={16} /> Post Job
                    </Link>
                </div>
            </motion.div>

            {/* ─── Stats Row ───────────────────────────────────── */}
            <div className="grid-4" style={{ marginBottom: 36 }}>
                {[
                    {
                        label: 'Jobs Posted', value: stats.jobCount, color: '#818cf8',
                        icon: Briefcase, sub: 'Total job listings',
                        barValue: stats.jobCount, barMax: Math.max(stats.jobCount, 10), delay: 0,
                    },
                    {
                        label: 'Active Jobs', value: stats.activeJobs, color: '#34d399',
                        icon: CheckCircle, sub: `${stats.jobCount - stats.activeJobs} inactive`,
                        barValue: stats.activeJobs, barMax: Math.max(stats.jobCount, 1), delay: 0.08,
                    },
                    {
                        label: 'Applications', value: stats.totalApps, color: '#22d3ee',
                        icon: Users, sub: 'Total received',
                        barValue: stats.totalApps, barMax: Math.max(stats.totalApps, 10), delay: 0.16,
                    },
                    {
                        label: 'Pending Review', value: stats.pendingApps, color: '#fbbf24',
                        icon: ClipboardList, sub: 'Need your decision',
                        barValue: stats.pendingApps, barMax: Math.max(stats.totalApps, 1), delay: 0.24,
                    },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} className="stat-card"
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: s.delay, duration: 0.4 }}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            <Icon size={80} color={s.color} style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05 }} />

                            <div style={{
                                width: 40, height: 40, borderRadius: 10, marginBottom: 14,
                                background: `${s.color}18`, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${s.color}22`,
                            }}>
                                <Icon size={20} color={s.color} />
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                                {s.value}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9', marginBottom: 2 }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{s.sub}</div>
                            <MiniBar value={s.barValue} max={s.barMax} color={s.color} />
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── Quick Actions ───────────────────────────────── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Zap size={20} color="#818cf8" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quick Actions</h2>
                </div>
                <div className="grid-4" style={{ marginBottom: 32 }}>
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                            >
                                <Link to={action.path} className="card" style={{
                                    display: 'block', textDecoration: 'none', color: 'inherit',
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                                        background: `${action.color}15`, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${action.color}25`,
                                        boxShadow: `0 4px 12px ${action.color}15`,
                                    }}>
                                        <Icon size={24} color={action.color} />
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#f1f5f9' }}>{action.label}</div>
                                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>{action.desc}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: action.color, fontSize: 13, fontWeight: 600 }}>
                                        Go <ArrowRight size={14} />
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

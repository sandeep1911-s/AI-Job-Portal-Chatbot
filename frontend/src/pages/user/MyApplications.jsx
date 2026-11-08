import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { Send, Clock, CheckCircle, XCircle, Building2, MapPin, Briefcase } from 'lucide-react';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const res = await API.get('/applications/my');
                setApplications(res.data);
            } catch (e) { } finally { setLoading(false); }
        }
        fetch();
    }, []);

    const statusConfig = {
        pending: { icon: Clock, color: '#fbbf24', label: 'Pending' },
        accepted: { icon: CheckCircle, color: '#4ade80', label: 'Accepted' },
        rejected: { icon: XCircle, color: '#f87171', label: 'Rejected' },
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">My Applications</h1>
                <p className="page-subtitle">Track the status of your job applications</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <Send size={48} />
                    <h3>No applications yet</h3>
                    <p>Browse jobs and start applying!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {applications.map((app, i) => {
                        const config = statusConfig[app.status] || statusConfig.pending;
                        const StatusIcon = config.icon;
                        return (
                            <motion.div key={app.id} className="card" style={{ cursor: 'default' }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12,
                                            background: `${config.color}15`, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <StatusIcon size={22} color={config.color} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{app.job_title || app.job?.title || 'Job'}</h3>
                                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Building2 size={12} /> {app.company || app.job?.company}
                                                </span>
                                                {app.job?.location && (
                                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <MapPin size={12} /> {app.job.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`badge badge-${app.status}`}>{config.label}</span>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                            {new Date(app.createdAt || app.applied_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { Building2, Trash2, Edit3, MapPin, Users, Eye, EyeOff } from 'lucide-react';

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchJobs(); }, []);

    const fetchJobs = async () => {
        try {
            const res = await API.get('/jobs/my');
            setJobs(res.data);
        } catch (e) { } finally { setLoading(false); }
    };

    const toggleActive = async (job) => {
        try {
            await API.put(`/jobs/${job.id}`, { is_active: !job.is_active });
            setJobs(jobs.map(j => j.id === job.id ? { ...j, is_active: !j.is_active } : j));
            setMessage({ type: 'success', text: `Job ${!job.is_active ? 'activated' : 'deactivated'}.` });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to update job.' });
        }
    };

    const deleteJob = async (id) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await API.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
            setMessage({ type: 'success', text: 'Job deleted.' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to delete job.' });
        }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">My Jobs</h1>
                <p className="page-subtitle">Manage your posted job vacancies</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <Building2 size={48} />
                    <h3>No jobs posted yet</h3>
                    <p>Post your first job vacancy to start receiving applications!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {jobs.map((job, i) => (
                        <motion.div key={job.id} className="card" style={{ cursor: 'default' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>{job.title}</h3>
                                        <span className={`badge ${job.is_active ? 'badge-approved' : 'badge-rejected'}`}>
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Building2 size={14} /> {job.company}
                                        </span>
                                        {job.location && (
                                            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                        )}
                                        <span className="badge badge-user">{job.job_type}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {(job.skills_required || []).map((s, si) => (
                                            <span key={si} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-sm btn-secondary" onClick={() => toggleActive(job)}>
                                        {job.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                                        {job.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

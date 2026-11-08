import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, XCircle, FileText, Clock, User, Mail, Building2 } from 'lucide-react';

export default function ManageApplications() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appLoading, setAppLoading] = useState(false);
    const [viewingCV, setViewingCV] = useState(null);
    const [cvData, setCvData] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await API.get('/jobs/my');
                setJobs(res.data);
                if (res.data.length > 0) {
                    setSelectedJob(res.data[0].id);
                    await fetchApplications(res.data[0].id);
                }
            } catch (e) { } finally { setLoading(false); }
        }
        fetchJobs();
    }, []);

    const fetchApplications = async (jobId) => {
        setAppLoading(true);
        try {
            const res = await API.get(`/applications/job/${jobId}`);
            setApplications(res.data);
        } catch (e) { } finally { setAppLoading(false); }
    };

    const handleJobSelect = (jobId) => {
        setSelectedJob(jobId);
        fetchApplications(jobId);
    };

    const updateStatus = async (appId, status) => {
        try {
            await API.put(`/applications/${appId}/status`, { status });
            setApplications(applications.map(a => a.id === appId ? { ...a, status } : a));
            setMessage({ type: 'success', text: `Application ${status}.` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update status.' });
        }
    };

    const viewCV = async (userId) => {
        try {
            const res = await API.get(`/cv/${userId}`);
            setCvData(res.data);
            setViewingCV(userId);
        } catch (e) {
            setMessage({ type: 'error', text: 'CV not found for this applicant.' });
        }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Manage Applications</h1>
                <p className="page-subtitle">Review and manage candidate applications for your jobs</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {/* CV Modal */}
            {viewingCV && cvData && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }} onClick={() => setViewingCV(null)}>
                    <div className="card-static" style={{ maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>📄 {cvData.full_name}'s CV</h2>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Mail size={14} /> {cvData.email}
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>📱 {cvData.phone}</span>
                        </div>

                        {cvData.ai_summary && (
                            <div style={{ marginBottom: 16, padding: 16, background: 'var(--primary-glow)', borderRadius: 10, borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 6 }}>AI SUMMARY</div>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>{cvData.ai_summary}</p>
                            </div>
                        )}

                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Skills</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                            {(cvData.skills || []).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                        </div>

                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Education</h4>
                        {(cvData.education || []).map((ed, i) => (
                            <div key={i} style={{ marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                                • {ed.degree} — {ed.institution} ({ed.year})
                            </div>
                        ))}

                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, marginTop: 12 }}>Experience</h4>
                        {(cvData.experience || []).map((exp, i) => (
                            <div key={i} style={{ marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                                • <strong>{exp.title}</strong> at {exp.company} ({exp.duration})
                                {exp.description && <p style={{ marginTop: 2, marginLeft: 12, color: 'var(--text-muted)' }}>{exp.description}</p>}
                            </div>
                        ))}

                        <button className="btn btn-secondary" onClick={() => setViewingCV(null)} style={{ marginTop: 16 }}>Close</button>
                    </div>
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <ClipboardList size={48} />
                    <h3>No jobs posted yet</h3>
                    <p>Post a job first to start receiving applications.</p>
                </div>
            ) : (
                <>
                    {/* Job Selector */}
                    <div style={{ marginBottom: 24 }}>
                        <label className="label">Select Job</label>
                        <select className="input" value={selectedJob || ''} onChange={e => handleJobSelect(parseInt(e.target.value))}>
                            {jobs.map(j => (
                                <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
                            ))}
                        </select>
                    </div>

                    {/* Applications */}
                    {appLoading ? <div className="spinner"></div> : (
                        applications.length === 0 ? (
                            <div className="empty-state">
                                <User size={48} />
                                <h3>No applications yet</h3>
                                <p>No one has applied for this job yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {applications.map((app, i) => (
                                    <motion.div key={app.id} className="card" style={{ cursor: 'default' }}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{app.applicant_name || 'Applicant'}</h3>
                                                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                                                </div>
                                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{app.applicant_email}</p>
                                                {app.cover_letter && (
                                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>
                                                        "{app.cover_letter.substring(0, 150)}..."
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button className="btn btn-sm btn-secondary" onClick={() => viewCV(app.user_id)}>
                                                    <FileText size={14} /> View CV
                                                </button>
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button className="btn btn-sm btn-success" onClick={() => updateStatus(app.id, 'accepted')}>
                                                            <CheckCircle size={14} /> Accept
                                                        </button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => updateStatus(app.id, 'rejected')}>
                                                            <XCircle size={14} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Search, Send, Building2, Clock, CheckCircle } from 'lucide-react';

export default function BrowseJobs() {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applyModal, setApplyModal] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (!search) { setFiltered(jobs); return; }
        const q = search.toLowerCase();
        setFiltered(jobs.filter(j =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q) ||
            (j.skills_required || []).some(s => s.toLowerCase().includes(q))
        ));
    }, [search, jobs]);

    const fetchJobs = async () => {
        try {
            const res = await API.get('/jobs');
            console.log('Fetched Jobs:', res.data); // Debug log
            setJobs(res.data);
            setFiltered(res.data);
        } catch (e) { } finally { setLoading(false); }
    };

    const handleApply = async (jobId) => {
        setApplying(jobId);
        try {
            await API.post(`/applications/${jobId}`, { cover_letter: coverLetter });
            setMessage({ type: 'success', text: '✅ Application submitted successfully!' });
            setApplyModal(null);
            setCoverLetter('');
            fetchJobs(); // Refresh to show "Applied" status
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to apply.' });
        } finally { setApplying(null); }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Browse Jobs</h1>
                <p className="page-subtitle">Find your perfect job opportunity</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {/* Search */}
            <div style={{ marginBottom: 24, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 44, fontSize: 15 }}
                    placeholder="Search by title, company, location, or skill..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Apply Modal */}
            {applyModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }} onClick={() => setApplyModal(null)}>
                    <div className="card-static" style={{ maxWidth: 500, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Apply for {applyModal.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>{applyModal.company}</p>
                        <div className="form-group">
                            <label className="label">Cover Letter (Optional)</label>
                            <textarea className="input" rows={5} placeholder="Tell the employer why you're a great fit..."
                                value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={() => setApplyModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => handleApply(applyModal.id)} disabled={applying === applyModal.id}>
                                {applying === applyModal.id ? 'Submitting...' : <><Send size={14} /> Submit Application</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Job List */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <Briefcase size={48} />
                    <h3>No jobs found</h3>
                    <p>{search ? 'Try a different search term' : 'No jobs available yet. Check back later!'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {filtered.map((job, i) => (
                        <motion.div key={job.id} className="card"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ cursor: 'default' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                            <Building2 size={14} /> {job.company}
                                        </span>
                                        {job.location && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                        )}
                                        {(job.salary_min || job.salary_max) && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                                <DollarSign size={14} />
                                                {job.salary_min && job.salary_max ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` :
                                                    job.salary_min ? `₹${job.salary_min.toLocaleString()}+` : `Up to ₹${job.salary_max.toLocaleString()}`}
                                            </span>
                                        )}
                                        <span className={`badge badge-${job.job_type === 'remote' ? 'open' : 'user'}`}>{job.job_type}</span>
                                    </div>
                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                        {job.description?.substring(0, 200)}{job.description?.length > 200 ? '...' : ''}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {(job.skills_required || []).map((s, si) => (
                                            <span key={si} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className={`btn ${job.is_applied ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => !job.is_applied && setApplyModal(job)}
                                    disabled={job.is_applied}
                                >
                                    {job.is_applied ? <><CheckCircle size={14} /> Applied</> : <><Send size={14} /> Apply</>}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

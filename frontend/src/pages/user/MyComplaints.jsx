import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { AlertCircle, PlusCircle, MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [providers, setProviders] = useState([]);
    const [providerId, setProviderId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [subject, setSubject] = useState('');
    const [complaintMsg, setComplaintMsg] = useState('');

    useEffect(() => {
        fetchComplaints();
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await API.get('/applications/my');
            const uniqueProviders = [];
            const seenIds = new Set();
            res.data.forEach(app => {
                if (app.provider_id && !seenIds.has(app.provider_id)) {
                    seenIds.add(app.provider_id);
                    uniqueProviders.push({ id: app.provider_id, company: app.company });
                }
            });
            setProviders(uniqueProviders);
        } catch (err) {
            console.error('Failed to load providers', err);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await API.get('/complaints/my');
            setComplaints(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load complaints.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!subject.trim() || !complaintMsg.trim()) {
            setMessage({ type: 'error', text: 'Subject and message are required.' });
            return;
        }

        setSubmitting(true);
        try {
            await API.post('/complaints', { subject, message: complaintMsg, provider_id: providerId || null });
            setMessage({ type: 'success', text: '✅ Complaint submitted successfully. We will review it shortly.' });
            setSubject('');
            setComplaintMsg('');
            setProviderId('');
            fetchComplaints(); // Refresh list
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to submit complaint.' });
        } finally {
            setSubmitting(false);
        }
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'resolved':
                return <span className="badge badge-success"><CheckCircle size={12} style={{ marginRight: 4 }} /> Resolved</span>;
            case 'replied':
                return <span className="badge badge-replied"><MessageSquare size={12} style={{ marginRight: 4 }} /> Replied</span>;
            default:
                return <span className="badge badge-open"><Clock size={12} style={{ marginRight: 4 }} /> Open</span>;
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 800 }}>
            <div className="page-header">
                <h1 className="page-title">
                    <AlertCircle size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                    Support & Complaints
                </h1>
                <p className="page-subtitle">Submit your issues or feedback to the admin team</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Submit Form Section */}
                <div className="card-static">
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlusCircle size={20} color="var(--primary)" />
                        Submit a New Complaint
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="label">Subject</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="E.g., Issue with job application"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Job Provider (Optional)</label>
                            <select
                                className="input"
                                value={providerId}
                                onChange={(e) => setProviderId(e.target.value)}
                                disabled={submitting}
                            >
                                <option value="">Select a Job Provider (General Complaint otherwise)</option>
                                {providers.map(p => (
                                    <option key={p.id} value={p.id}>{p.company}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label">Message Details</label>
                            <textarea
                                className="input"
                                placeholder="Please describe your issue in detail..."
                                style={{ minHeight: 120 }}
                                value={complaintMsg}
                                onChange={(e) => setComplaintMsg(e.target.value)}
                                disabled={submitting}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={submitting || !subject.trim() || !complaintMsg.trim()}
                        >
                            {submitting ? (
                                'Submitting...'
                            ) : (
                                <><Send size={16} /> Submit Complaint</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Complaint History Section */}
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Previous Complaints</h2>

                    {loading ? (
                        <div className="spinner" style={{ margin: '40px auto' }}></div>
                    ) : complaints.length === 0 ? (
                        <div className="empty-state">
                            <MessageSquare size={48} />
                            <h3>No complaints found</h3>
                            <p>You haven't submitted any complaints yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {complaints.map((complaint, index) => (
                                <motion.div
                                    key={complaint.id}
                                    className="card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {complaint.subject}
                                        </h3>
                                        <StatusBadge status={complaint.status} />
                                    </div>

                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                                        {complaint.message}
                                    </p>

                                    {complaint.admin_reply && (
                                        <div style={{
                                            background: 'rgba(129, 140, 248, 0.05)',
                                            borderLeft: '3px solid var(--primary-light)',
                                            padding: '12px 16px',
                                            borderRadius: '0 8px 8px 0',
                                            marginTop: 16
                                        }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 4 }}>
                                                Admin Reply:
                                            </p>
                                            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                                {complaint.admin_reply}
                                            </p>
                                        </div>
                                    )}



                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, textAlign: 'right' }}>
                                        Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { AlertCircle, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';

export default function ProviderComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState(null);
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const res = await API.get('/complaints/provider');
            setComplaints(res.data);
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to load complaints.' });
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (id) => {
        if (!reply.trim()) return;
        try {
            await API.put(`/complaints/${id}/provider-reply`, { provider_reply: reply });
            setComplaints(complaints.map(c => c.id === id ? { ...c, provider_reply: reply, status: 'replied' } : c));
            setReplyId(null);
            setReply('');
            setMessage({ type: 'success', text: 'Reply sent successfully.' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to send reply.' });
        }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const statusIcon = { open: Clock, replied: CheckCircle, resolved: CheckCircle };
    const statusColor = { open: '#fbbf24', replied: '#c084fc', resolved: '#4ade80' };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Received Complaints</h1>
                <p className="page-subtitle">View and reply to complaints directed at you ({complaints.length} total)</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {complaints.length === 0 ? (
                <div className="empty-state">
                    <AlertCircle size={48} />
                    <h3>No complaints</h3>
                    <p>You have not received any complaints. Great job! 🎉</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {complaints.map((c, i) => {
                        const StatusIcon = statusIcon[c.status] || Clock;
                        return (
                            <motion.div key={c.id} className="card" style={{ cursor: 'default' }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{c.subject}</h3>
                                            <span className={`badge badge-${c.status === 'resolved' || c.status === 'replied' ? 'success' : 'open'}`}>{c.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>

                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                    {c.message}
                                </p>

                                {/* Provider Reply */}
                                {c.provider_reply && (
                                    <div style={{
                                        padding: 12, borderRadius: 10, marginBottom: 12,
                                        background: 'rgba(52, 211, 153, 0.1)', borderLeft: '3px solid #34d399',
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', marginBottom: 4 }}>YOUR REPLY</div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.provider_reply}</p>
                                    </div>
                                )}

                                {/* Admin Message to Provider */}
                                {c.admin_message_to_provider && (
                                    <div style={{
                                        padding: 12, borderRadius: 10, marginBottom: 12,
                                        background: 'rgba(251, 146, 60, 0.1)', borderLeft: '3px solid #f97316',
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#f97316', marginBottom: 4 }}>ADMIN MESSAGE TO YOU</div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.admin_message_to_provider}</p>
                                    </div>
                                )}

                                {/* Admin Reply */}
                                {c.admin_reply && (
                                    <div style={{
                                        padding: 12, borderRadius: 10, marginBottom: 12,
                                        background: 'rgba(168, 85, 247, 0.1)', borderLeft: '3px solid #c084fc',
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#c084fc', marginBottom: 4 }}>ADMIN REPLY</div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.admin_reply}</p>
                                    </div>
                                )}

                                {/* Reply Input */}
                                {replyId === c.id ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <textarea className="input" rows={2} placeholder="Type your reply..."
                                            value={reply} onChange={e => setReply(e.target.value)} style={{ flex: 1 }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleReply(c.id)}>
                                                <Send size={14} /> Send
                                            </button>
                                            <button className="btn btn-sm btn-secondary" onClick={() => { setReplyId(null); setReply(''); }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn btn-sm btn-secondary" onClick={() => { setReplyId(c.id); setReply(c.provider_reply || ''); }}>
                                        <MessageSquare size={14} /> {c.provider_reply ? 'Update Reply' : 'Reply'}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


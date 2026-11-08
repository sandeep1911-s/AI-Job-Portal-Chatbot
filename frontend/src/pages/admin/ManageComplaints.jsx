import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { AlertCircle, MessageSquare, Send, User, Clock, CheckCircle, Building2, Mail } from 'lucide-react';

export default function ManageComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState(null);
    const [reply, setReply] = useState('');
    const [providerMsgId, setProviderMsgId] = useState(null);
    const [providerMsg, setProviderMsg] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const res = await API.get('/complaints');
            setComplaints(res.data);
        } catch (e) { } finally { setLoading(false); }
    };

    const handleReply = async (id) => {
        if (!reply.trim()) return;
        try {
            await API.put(`/complaints/${id}/reply`, { admin_reply: reply });
            setComplaints(complaints.map(c => c.id === id ? { ...c, admin_reply: reply, status: 'replied' } : c));
            setReplyId(null);
            setReply('');
            setMessage({ type: 'success', text: 'Reply sent successfully.' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to send reply.' });
        }
    };

    const handleMessageProvider = async (id) => {
        if (!providerMsg.trim()) return;
        try {
            await API.put(`/complaints/${id}/message-provider`, { admin_message_to_provider: providerMsg });
            setComplaints(complaints.map(c => c.id === id ? { ...c, admin_message_to_provider: providerMsg } : c));
            setProviderMsgId(null);
            setProviderMsg('');
            setMessage({ type: 'success', text: 'Message sent to provider successfully.' });
        } catch (e) {
            setMessage({ type: 'error', text: e.response?.data?.error || 'Failed to send message to provider.' });
        }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const statusIcon = { open: Clock, replied: CheckCircle, resolved: CheckCircle };
    const statusColor = { open: '#fbbf24', replied: '#c084fc', resolved: '#4ade80' };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Manage Complaints</h1>
                <p className="page-subtitle">View and reply to user complaints ({complaints.length} total)</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {complaints.length === 0 ? (
                <div className="empty-state">
                    <AlertCircle size={48} />
                    <h3>No complaints</h3>
                    <p>No complaints have been submitted yet. 🎉</p>
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
                                            <span className={`badge badge-${c.status}`}>{c.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <User size={12} /> {c.username || 'User'}
                                            </span>
                                            {c.provider_name && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                                    <Building2 size={12} /> Against: {c.provider_name}
                                                </span>
                                            )}
                                            {(!c.provider_name && c.provider_id) && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                                    <Building2 size={12} /> Against Provider #{c.provider_id}
                                                </span>
                                            )}
                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                    {c.message}
                                </p>

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

                                {/* Provider Reply */}
                                {c.provider_reply && (
                                    <div style={{
                                        padding: 12, borderRadius: 10, marginBottom: 12,
                                        background: 'rgba(52, 211, 153, 0.1)', borderLeft: '3px solid #34d399',
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', marginBottom: 4 }}>PROVIDER REPLY</div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.provider_reply}</p>
                                    </div>
                                )}

                                {/* Admin Message to Provider */}
                                {c.admin_message_to_provider && (
                                    <div style={{
                                        padding: 12, borderRadius: 10, marginBottom: 12,
                                        background: 'rgba(251, 146, 60, 0.1)', borderLeft: '3px solid #f97316',
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#f97316', marginBottom: 4 }}>MESSAGE TO PROVIDER</div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.admin_message_to_provider}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {/* Reply to User Input */}
                                    {replyId === c.id ? (
                                        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                                            <textarea className="input" rows={2} placeholder="Type your reply to user..."
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
                                        <button className="btn btn-sm btn-secondary" onClick={() => { setReplyId(c.id); setReply(c.admin_reply || ''); setProviderMsgId(null); }}>
                                            <MessageSquare size={14} /> {c.admin_reply ? 'Update Reply' : 'Reply to User'}
                                        </button>
                                    )}

                                    {/* Message Provider Input */}
                                    {(c.provider_name || c.provider_id) && (
                                        providerMsgId === c.id ? (
                                            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                                                <textarea className="input" rows={2} placeholder={`Message to ${c.provider_name || 'Provider #' + c.provider_id}...`}
                                                    value={providerMsg} onChange={e => setProviderMsg(e.target.value)} style={{ flex: 1 }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    <button className="btn btn-sm btn-primary" style={{ background: '#f97316' }} onClick={() => handleMessageProvider(c.id)}>
                                                        <Mail size={14} /> Send
                                                    </button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => { setProviderMsgId(null); setProviderMsg(''); }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="btn btn-sm btn-secondary" style={{ borderColor: '#f97316', color: '#f97316' }}
                                                onClick={() => { setProviderMsgId(c.id); setProviderMsg(c.admin_message_to_provider || ''); setReplyId(null); }}>
                                                <Mail size={14} /> {c.admin_message_to_provider ? 'Update Message to Provider' : 'Message Provider'}
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

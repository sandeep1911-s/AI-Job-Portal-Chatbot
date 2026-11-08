import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { UserCheck, CheckCircle, XCircle, Building2, Mail, Clock, FileText } from 'lucide-react';

const BASE_URL = 'http://localhost:8000';

export default function ManageProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchProviders(); }, []);

    const fetchProviders = async () => {
        try {
            const res = await API.get('/admin/providers');
            setProviders(res.data);
        } catch (e) { } finally { setLoading(false); }
    };

    const handleApproval = async (id, approve) => {
        try {
            await API.put(`/admin/providers/${id}/approve`, { approve });
            setProviders(providers.map(p => p.id === id ? { ...p, is_approved: approve } : p));
            setMessage({ type: 'success', text: `Provider ${approve ? 'approved' : 'rejected'} successfully.` });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to update provider status.' });
        }
    };

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    const pending = providers.filter(p => !p.is_approved);
    const approved = providers.filter(p => p.is_approved);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Manage Providers</h1>
                <p className="page-subtitle">Approve or reject job provider registrations</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {/* Pending */}
            {pending.length > 0 && (
                <>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={18} color="#fbbf24" /> Pending Approval ({pending.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                        {pending.map((p, i) => (
                            <motion.div key={p.id} className="card" style={{ cursor: 'default', borderColor: '#fbbf2440' }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <Building2 size={18} color="var(--text-secondary)" />
                                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{p.username}</h3>
                                            <span className="badge badge-pending">Pending</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Mail size={12} /> {p.email}
                                        </p>
                                        {p.id_proof && (
                                            <a href={`${BASE_URL}/${p.id_proof}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, color: '#3b82f6', textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>
                                                <FileText size={14} /> View ID Proof
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-sm btn-success" onClick={() => handleApproval(p.id, true)}>
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleApproval(p.id, false)}>
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Approved */}
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={18} color="#4ade80" /> Approved Providers ({approved.length})
            </h2>
            {approved.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No approved providers yet.</p>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Username</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {approved.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.username}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{p.email}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td><span className="badge badge-approved">Approved</span></td>
                                    <td style={{ display: 'flex', alignItems: 'center' }}>
                                        {p.id_proof && (
                                            <a href={`${BASE_URL}/${p.id_proof}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 12, color: '#3b82f6', textDecoration: 'none' }}>
                                                <FileText size={14} /> View ID
                                            </a>
                                        )}
                                        <button className="btn btn-sm btn-danger" onClick={() => handleApproval(p.id, false)}>Revoke</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

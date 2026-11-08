import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';

export default function ViewFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const res = await API.get('/feedback');
                setFeedbacks(res.data);
            } catch (e) { } finally { setLoading(false); }
        }
        fetch();
    }, []);

    if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">User Feedback</h1>
                <p className="page-subtitle">View feedback from platform users ({feedbacks.length} total)</p>
            </div>

            {feedbacks.length === 0 ? (
                <div className="empty-state">
                    <Star size={48} />
                    <h3>No feedback yet</h3>
                    <p>Users haven't submitted any feedback yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {feedbacks.map((fb, i) => (
                        <motion.div key={fb.id} className="card" style={{ cursor: 'default' }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <User size={16} color="var(--text-muted)" />
                                        <span style={{ fontWeight: 600 }}>{fb.username || 'User'}</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{fb.message}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={18}
                                            fill={s <= fb.rating ? '#fbbf24' : 'none'}
                                            color={s <= fb.rating ? '#fbbf24' : 'var(--border)'}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

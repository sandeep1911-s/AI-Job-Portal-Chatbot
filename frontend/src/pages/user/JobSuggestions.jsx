import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Target, Briefcase, RefreshCw } from 'lucide-react';

export default function JobSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchSuggestions(); }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await API.get('/ai/job-suggestions');
            setSuggestions(res.data.suggestions || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get suggestions. Make sure you have created a CV first.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-container" style={{ maxWidth: 800 }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">
                        <Lightbulb size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                        AI Job Suggestions
                    </h1>
                    <p className="page-subtitle">Personalized job recommendations based on your CV skills</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchSuggestions} disabled={loading}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>
                        <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
                        AI is analyzing your skills and finding matches...
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {suggestions.map((s, i) => (
                        <motion.div key={i} className="card"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12,
                                            background: 'rgba(129, 140, 248, 0.15)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Briefcase size={22} color="#818cf8" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: 17, fontWeight: 700 }}>{s.title}</h3>
                                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.company || 'Various Companies'}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                                        {s.reason}
                                    </p>
                                </div>
                                {/* Match Score */}
                                <div style={{
                                    textAlign: 'center', padding: '8px 16px', borderRadius: 12,
                                    background: s.match_score >= 80 ? 'rgba(34, 197, 94, 0.15)' :
                                        s.match_score >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                }}>
                                    <div style={{
                                        fontSize: 24, fontWeight: 800,
                                        color: s.match_score >= 80 ? '#4ade80' : s.match_score >= 60 ? '#fbbf24' : '#f87171',
                                    }}>
                                        {s.match_score}%
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {suggestions.length === 0 && !error && (
                        <div className="empty-state">
                            <Target size={48} />
                            <h3>No suggestions yet</h3>
                            <p>Create your CV first to get AI-powered job suggestions</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

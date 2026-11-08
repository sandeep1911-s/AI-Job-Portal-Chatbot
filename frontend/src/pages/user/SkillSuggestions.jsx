import React, { useState, useEffect } from 'react';
import API from '../../api';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, RefreshCw, BookOpen, Zap, ArrowRight } from 'lucide-react';

export default function SkillSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchSuggestions(); }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await API.get('/ai/skill-suggestions');
            setSuggestions(res.data.skill_suggestions || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get suggestions. Create your CV first.');
        } finally { setLoading(false); }
    };

    const priorityColors = { High: '#f87171', Medium: '#fbbf24', Low: '#4ade80' };
    const categoryIcons = { Technical: Zap, Soft: BookOpen, Domain: TrendingUp };

    return (
        <div className="page-container" style={{ maxWidth: 800 }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">
                        <TrendingUp size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                        Skill Growth Advisor
                    </h1>
                    <p className="page-subtitle">AI-recommended skills to future-proof your career</p>
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
                        AI is analyzing industry trends for you...
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {suggestions.map((s, i) => {
                        const CatIcon = categoryIcons[s.category] || Zap;
                        return (
                            <motion.div key={i} className="card"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                        background: `${priorityColors[s.priority] || '#818cf8'}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <CatIcon size={24} color={priorityColors[s.priority] || '#818cf8'} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <h3 style={{ fontSize: 17, fontWeight: 700 }}>{s.skill}</h3>
                                            <span className="badge" style={{
                                                background: `${priorityColors[s.priority]}20`,
                                                color: priorityColors[s.priority],
                                            }}>{s.priority} Priority</span>
                                            <span className="badge badge-user">{s.category}</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                                            {s.reason}
                                        </p>
                                        {s.resources && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary-light)' }}>
                                                <BookOpen size={14} />
                                                <span>Recommended: {s.resources}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {suggestions.length === 0 && !error && (
                        <div className="empty-state">
                            <TrendingUp size={48} />
                            <h3>No suggestions yet</h3>
                            <p>Create your CV first to get personalized skill recommendations</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

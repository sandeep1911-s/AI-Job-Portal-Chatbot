import React, { useState } from 'react';
import API from '../api';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : m.role,
                parts: [m.content],
            }));
            const res = await API.post('/ai/chat', { message: input, history });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">
                    <MessageSquare size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                    AI Career Counselor
                </h1>
                <p className="page-subtitle">Get career advice, resume tips, and interview preparation help</p>
            </div>

            {/* Chat Messages */}
            <div style={{
                flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16,
                padding: '16px 0', marginBottom: 16,
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <Bot size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>How can I help your career?</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                            {['How to improve my resume?', 'Top skills for 2026', 'Interview preparation tips', 'Career switch advice'].map(q => (
                                <button key={q} className="btn btn-sm btn-secondary"
                                    onClick={() => { setInput(q); }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'flex', gap: 12,
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                        {msg.role === 'assistant' && (
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: 'var(--primary-glow)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Sparkles size={18} color="var(--primary-light)" />
                            </div>
                        )}
                        <div style={{
                            maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                                : 'var(--bg-card)',
                            border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                            fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                        }}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: 'rgba(16, 185, 129, 0.15)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <User size={18} color="#34d399" />
                            </div>
                        )}
                    </motion.div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--primary-glow)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={18} color="var(--primary-light)" />
                        </div>
                        <div style={{ padding: '12px 16px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s ease infinite' }}></span>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s ease 0.2s infinite' }}></span>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s ease 0.4s infinite' }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
                display: 'flex', gap: 8, flexShrink: 0,
                padding: '16px 0', borderTop: '1px solid var(--border)',
            }}>
                <input className="input" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask about careers, resumes, interviews..." style={{ flex: 1 }} />
                <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}

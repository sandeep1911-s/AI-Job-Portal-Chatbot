import React, { useState } from 'react';
import API from '../api';
import StarRating from './StarRating';
import { Send, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeedbackSection() {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setStatus({ type: 'error', text: 'Please select a star rating.' });
            return;
        }
        if (!message.trim()) {
            setStatus({ type: 'error', text: 'Please enter a message.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', text: '' });

        try {
            await API.post('/feedback', { rating, message });
            setStatus({ type: 'success', text: 'Thank you! Your feedback has been submitted.' });
            setRating(0);
            setMessage('');
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to submit feedback.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Star size={24} color="#fbbf24" fill="#fbbf24" />
                        Share Your Feedback
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                        How is your experience with Pathify? Let us know how we can improve.
                    </p>
                </div>

                {status.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`alert alert-${status.type}`}
                        style={{ marginBottom: 20 }}
                    >
                        {status.text}
                    </motion.div>
                )}

                <div className="card-static" style={{ padding: '24px 32px' }}>
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        gap: 40,
                        alignItems: 'flex-start',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: '0 0 auto', minWidth: 200 }}>
                            <label className="label" style={{ marginBottom: 12, fontSize: 15 }}>Overall Rating</label>
                            <StarRating rating={rating} setRating={setRating} disabled={loading} />
                            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                                {rating > 0 ? `${rating} stars selected` : 'Select a rating'}
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="label" style={{ fontSize: 15 }}>Your Message</label>
                                <textarea
                                    className="input"
                                    placeholder="What do you think about the platform?"
                                    style={{ minHeight: 80, fontSize: 15, resize: 'vertical' }}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || !message.trim() || rating === 0}
                                    style={{ padding: '10px 32px' }}
                                >
                                    {loading ? 'Submitting...' : <><Send size={16} /> Submit Feedback</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

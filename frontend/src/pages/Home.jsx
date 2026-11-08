import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Lightbulb, TrendingUp, Shield, Sparkles, ArrowRight, Users, Building2 } from 'lucide-react';

export default function Home() {
    const { token, user } = useAuth();

    const features = [
        { icon: FileText, title: 'AI CV Builder', desc: 'Create a professional CV with AI-generated summaries that highlight your strengths.', color: '#818cf8' },
        { icon: Lightbulb, title: 'Smart Job Suggestions', desc: 'Get AI-powered job recommendations perfectly matched to your skills.', color: '#22d3ee' },
        { icon: TrendingUp, title: 'Skill Growth Advisor', desc: 'Discover future-proof skills that will accelerate your career.', color: '#34d399' },
        { icon: Building2, title: 'For Employers', desc: 'Post vacancies, review applications, and find the perfect candidates.', color: '#fbbf24' },
        { icon: Shield, title: 'Admin Control', desc: 'Full platform management with feedback, complaints, and user oversight.', color: '#f87171' },
        { icon: Sparkles, title: 'AI Career Chat', desc: 'Get instant career advice from our intelligent AI counselor.', color: '#c084fc' },
    ];

    return (
        <div>
            {/* Hero */}
            <section style={{
                padding: '100px 24px 80px',
                textAlign: 'center',
                background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative orbs */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%)',
                    top: -100, left: -100,
                }} />
                <div style={{
                    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08), transparent 70%)',
                    bottom: -50, right: -50,
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px', borderRadius: 20,
                        background: 'var(--primary-glow)', color: 'var(--primary-light)',
                        fontSize: 13, fontWeight: 600, marginBottom: 24,
                    }}>
                        <Sparkles size={14} /> Powered by AI
                    </div>

                    <h1 style={{
                        fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20,
                        background: 'linear-gradient(135deg, #f1f5f9 30%, #10b981 70%, #0ea5e9)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Your Career,<br />Supercharged by AI
                    </h1>

                    <p style={{
                        fontSize: 18, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 40px',
                        lineHeight: 1.6,
                    }}>
                        Build your CV, discover perfect jobs, and grow your skills — all powered by
                        intelligent AI that understands your unique career path.
                    </p>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {token ? (
                            <Link to="/dashboard" className="btn btn-lg btn-primary">
                                Go to Dashboard <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-lg btn-primary">
                                    Get Started Free <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn btn-lg btn-secondary">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex', gap: 48, justifyContent: 'center', marginTop: 60,
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { value: 'AI', label: 'Powered Platform' },
                            { value: '3', label: 'User Roles' },
                            { value: '∞', label: 'Career Possibilities' },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: 32, fontWeight: 800,
                                    background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
                        Everything You Need
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                        A complete AI-powered ecosystem for job seekers, employers, and administrators
                    </p>
                </div>

                <div className="grid-3">
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <motion.div
                                key={i}
                                className="card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: `${feat.color}15`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                                }}>
                                    <Icon size={24} color={feat.color} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{feat.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '80px 24px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.08))',
            }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
                    Ready to Transform Your Career?
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>
                    Join as a Job Seeker or Employer — your AI-powered career journey starts here.
                </p>
                {!token && (
                    <Link to="/register" className="btn btn-lg btn-primary">
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                )}
            </section>
        </div>
    );
}

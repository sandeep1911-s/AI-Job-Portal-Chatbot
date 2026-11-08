import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Sparkles, Save, GraduationCap, Wrench, Briefcase, Target, RefreshCw, Eye } from 'lucide-react';

export default function CVBuilder() {
    const [form, setForm] = useState({
        full_name: '', email: '', phone: '', career_goals: '',
        education: [{ degree: '', institution: '', year: '' }],
        skills: [],
        experience: [{ title: '', company: '', duration: '', description: '' }],
    });
    const [skillInput, setSkillInput] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function loadCV() {
            try {
                const res = await API.get('/cv');
                const cv = res.data;
                setForm({
                    full_name: cv.full_name || '', email: cv.email || '', phone: cv.phone || '',
                    career_goals: cv.career_goals || '',
                    education: cv.education?.length ? cv.education : [{ degree: '', institution: '', year: '' }],
                    skills: cv.skills || [],
                    experience: cv.experience?.length ? cv.experience : [{ title: '', company: '', duration: '', description: '' }],
                });
                setAiSummary(cv.ai_summary || '');
            } catch (e) { } finally { setFetchLoading(false); }
        }
        loadCV();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await API.post('/cv', form);
            setAiSummary(res.data.ai_summary || '');
            setMessage({ type: 'success', text: '✅ CV saved successfully! AI summary generated.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save CV.' });
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
            setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
    };

    const addEducation = () => {
        setForm({ ...form, education: [...form.education, { degree: '', institution: '', year: '' }] });
    };

    const removeEducation = (i) => {
        if (form.education.length > 1) {
            setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
        }
    };

    const updateEducation = (i, field, value) => {
        const updated = [...form.education];
        updated[i] = { ...updated[i], [field]: value };
        setForm({ ...form, education: updated });
    };

    const addExperience = () => {
        setForm({ ...form, experience: [...form.experience, { title: '', company: '', duration: '', description: '' }] });
    };

    const removeExperience = (i) => {
        if (form.experience.length > 1) {
            setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
        }
    };

    const updateExperience = (i, field, value) => {
        const updated = [...form.experience];
        updated[i] = { ...updated[i], [field]: value };
        setForm({ ...form, experience: updated });
    };

    const regenerateSummary = async () => {
        setLoading(true);
        try {
            const res = await API.post('/cv/regenerate-summary');
            setAiSummary(res.data.ai_summary);
            setMessage({ type: 'success', text: '✅ AI summary regenerated!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to regenerate summary.' });
        } finally { setLoading(false); }
    };

    if (fetchLoading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;

    return (
        <motion.div className="page-container" style={{ maxWidth: 800 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="page-header">
                <h1 className="page-title">
                    <FileText size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                    AI CV Builder
                </h1>
                <p className="page-subtitle">Fill in your details and our AI will generate a professional summary</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {/* AI Summary Display */}
            {aiSummary && (
                <motion.div className="card-static" style={{ marginBottom: 24, borderColor: 'var(--primary)', position: 'relative' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Sparkles size={18} color="var(--primary-light)" />
                        <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>AI-Generated Summary</span>
                        <button className="btn btn-sm btn-secondary" onClick={regenerateSummary} disabled={loading}
                            style={{ marginLeft: 'auto' }}>
                            <RefreshCw size={14} /> Regenerate
                        </button>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>{aiSummary}</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <div className="card-static" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Personal Information</h3>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Full Name</label>
                            <input className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                                placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="john@example.com" required />
                        </div>
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Phone</label>
                            <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+91 9876543210" />
                        </div>
                        <div className="form-group">
                            <label className="label">Career Goals</label>
                            <input className="input" value={form.career_goals} onChange={e => setForm({ ...form, career_goals: e.target.value })}
                                placeholder="What do you want to achieve?" />
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="card-static" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>🎓 Education</h3>
                        <button type="button" className="btn btn-sm btn-secondary" onClick={addEducation}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    {form.education.map((edu, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <input className="input" placeholder="Degree (e.g. B.Tech CS)" value={edu.degree}
                                    onChange={e => updateEducation(i, 'degree', e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input className="input" placeholder="Institution" value={edu.institution}
                                    onChange={e => updateEducation(i, 'institution', e.target.value)} />
                            </div>
                            <div style={{ width: 100 }}>
                                <input className="input" placeholder="Year" value={edu.year}
                                    onChange={e => updateEducation(i, 'year', e.target.value)} />
                            </div>
                            {form.education.length > 1 && (
                                <button type="button" onClick={() => removeEducation(i)}
                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 10 }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="card-static" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🛠️ Skills</h3>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input className="input" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                            placeholder="Type a skill and press Add" style={{ flex: 1 }}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                        <button type="button" className="btn btn-primary" onClick={addSkill}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {form.skills.map((s, i) => (
                            <span key={i} className="skill-tag">
                                {s} <span className="skill-tag-remove" onClick={() => removeSkill(s)}>×</span>
                            </span>
                        ))}
                        {form.skills.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No skills added yet</span>}
                    </div>
                </div>

                {/* Experience */}
                <div className="card-static" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>💼 Experience</h3>
                        <button type="button" className="btn btn-sm btn-secondary" onClick={addExperience}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    {form.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: 16, padding: 16, background: 'rgba(16, 185, 129, 0.05)', borderRadius: 12 }}>
                            <div className="grid-2" style={{ marginBottom: 8 }}>
                                <input className="input" placeholder="Job Title" value={exp.title}
                                    onChange={e => updateExperience(i, 'title', e.target.value)} />
                                <input className="input" placeholder="Company" value={exp.company}
                                    onChange={e => updateExperience(i, 'company', e.target.value)} />
                            </div>
                            <div className="grid-2" style={{ marginBottom: 8 }}>
                                <input className="input" placeholder="Duration (e.g. 2 years)" value={exp.duration}
                                    onChange={e => updateExperience(i, 'duration', e.target.value)} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {form.experience.length > 1 && (
                                        <button type="button" onClick={() => removeExperience(i)}
                                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                            <textarea className="input" placeholder="Describe your role..." value={exp.description}
                                onChange={e => updateExperience(i, 'description', e.target.value)} rows={2} />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ flex: 1 }}>
                        {loading ? (
                            <>Generating AI Summary & Saving...</>
                        ) : (
                            <><Save size={18} /> Save CV & Generate AI Summary</>
                        )}
                    </button>
                    <Link to="/print-cv" className="btn btn-secondary btn-lg">
                        <Eye size={18} /> View / Print CV
                    </Link>
                </div>
            </form>
        </motion.div>
    );
}

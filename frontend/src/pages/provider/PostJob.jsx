import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { PlusCircle, Plus, Trash2, Save } from 'lucide-react';

export default function PostJob() {
    const [form, setForm] = useState({
        title: '', company: '', description: '', location: '', job_type: 'full-time',
        salary_min: '', salary_max: '', skills_required: [],
    });
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const addSkill = () => {
        if (skillInput.trim() && !form.skills_required.includes(skillInput.trim())) {
            setForm({ ...form, skills_required: [...form.skills_required, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const payload = {
                ...form,
                salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
                salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
            };
            await API.post('/jobs', payload);
            setMessage({ type: 'success', text: '✅ Job posted successfully!' });
            setTimeout(() => navigate('/my-jobs'), 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to post job.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="page-container" style={{ maxWidth: 700 }}>
            <div className="page-header">
                <h1 className="page-title">
                    <PlusCircle size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
                    Post New Job
                </h1>
                <p className="page-subtitle">Create a new job vacancy for candidates to apply</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card-static" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Job Details</h3>
                    <div className="form-group">
                        <label className="label">Job Title</label>
                        <input className="input" placeholder="e.g. Senior React Developer" required
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Company Name</label>
                            <input className="input" placeholder="e.g. Tech Corp" required
                                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="label">Location</label>
                            <input className="input" placeholder="e.g. Bangalore, India"
                                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="label">Job Type</label>
                            <select className="input" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                                <option value="full-time">Full-Time</option>
                                <option value="part-time">Part-Time</option>
                                <option value="remote">Remote</option>
                                <option value="internship">Internship</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Salary Range (₹)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input className="input" type="number" placeholder="Min"
                                    value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} />
                                <input className="input" type="number" placeholder="Max"
                                    value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Job Description</label>
                        <textarea className="input" rows={5} placeholder="Describe the role, responsibilities, and requirements..."
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                    </div>
                </div>

                <div className="card-static" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Required Skills</h3>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input className="input" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                            placeholder="Type a skill and press Add" style={{ flex: 1 }}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                        <button type="button" className="btn btn-primary" onClick={addSkill}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {form.skills_required.map((s, i) => (
                            <span key={i} className="skill-tag">
                                {s}
                                <span className="skill-tag-remove" onClick={() => setForm({
                                    ...form, skills_required: form.skills_required.filter((_, idx) => idx !== i)
                                })}>×</span>
                            </span>
                        ))}
                    </div>
                </div>

                <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Posting...' : <><Save size={18} /> Post Job</>}
                </button>
            </form>
        </div>
    );
}

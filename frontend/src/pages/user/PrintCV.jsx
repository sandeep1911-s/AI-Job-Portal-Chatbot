import React, { useState, useEffect } from 'react';
import API from '../../api';
import { Mail, Phone, MapPin, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrintCV() {
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCV() {
            try {
                const res = await API.get('/cv');
                setCv(res.data);
            } catch (e) {
                console.error("Failed to load CV", e);
            } finally {
                setLoading(false);
            }
        }
        loadCV();
    }, []);

    if (loading) return <div className="spinner" style={{ minHeight: '100vh', background: 'white' }}></div>;
    if (!cv) return (
        <div className="page-container" style={{ textAlign: 'center', background: 'white', color: 'black', minHeight: '100vh' }}>
            <h2>No CV found. Please create one first.</h2>
            <button className="btn btn-primary" onClick={() => navigate('/cv-builder')}>Go to CV Builder</button>
        </div>
    );

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '1px' }}>
            {/* Control Bar - Hidden on print */}
            <div className="no-print" style={{
                maxWidth: '210mm', margin: '20px auto', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', background: 'white', padding: '12px 24px', borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <button className="btn btn-secondary" onClick={() => navigate('/cv-builder')}>
                    <ArrowLeft size={16} /> Back to Builder
                </button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    <Printer size={16} /> Print / Save as PDF
                </button>
            </div>

            {/* A4 Paper */}
            <div className="cv-a4-page">
                <header className="cv-header">
                    <h1 className="cv-name">{cv.full_name}</h1>
                    <div className="cv-contact">
                        {cv.email && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {cv.email}</span>}
                        {cv.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> {cv.phone}</span>}
                        {cv.career_goals && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {cv.career_goals}</span>}
                    </div>
                </header>

                {cv.ai_summary && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Professional Summary</h2>
                        <p className="cv-item-desc">{cv.ai_summary}</p>
                    </section>
                )}

                {cv.experience && cv.experience.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Experience</h2>
                        {cv.experience.map((exp, i) => (
                            <div key={i} className="cv-item">
                                <div className="cv-item-header">
                                    <span>{exp.title}</span>
                                    <span style={{ color: '#64748b', fontSize: 13 }}>{exp.duration}</span>
                                </div>
                                <div className="cv-item-sub">{exp.company}</div>
                                <p className="cv-item-desc">{exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {cv.education && cv.education.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Education</h2>
                        {cv.education.map((edu, i) => (
                            <div key={i} className="cv-item">
                                <div className="cv-item-header">
                                    <span>{edu.degree}</span>
                                    <span style={{ color: '#64748b', fontSize: 13 }}>{edu.year}</span>
                                </div>
                                <div className="cv-item-sub">{edu.institution}</div>
                            </div>
                        ))}
                    </section>
                )}

                {cv.skills && cv.skills.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Skills</h2>
                        <div className="cv-skills-grid">
                            {cv.skills.map((skill, i) => (
                                <span key={i} className="cv-skill-pill">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

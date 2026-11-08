import React, { useState, useEffect } from 'react';
import api from '../api';

const Profile = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        education_level: '',
        skills: '',
        interests: '',
        personality_traits: '',
        career_goals: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Mock user ID for now
    const userId = 1;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/profile/${userId}`);
            // Convert arrays back to comma-separated strings for editing
            setFormData({
                ...res.data,
                skills: res.data.skills.join(', '),
                interests: res.data.interests.join(', '),
                personality_traits: res.data.personality_traits.join(', ')
            });
        } catch (err) {
            console.log("Profile not found or error", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const payload = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
            personality_traits: formData.personality_traits.split(',').map(s => s.trim()).filter(s => s)
        };

        try {
            await api.post(`/profile/${userId}`, payload);
            setMessage('Profile saved successfully!');
        } catch (err) {
            setMessage('Error saving profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Build Your Profile</h2>
                <p className="text-slate-600">Help our AI counselor understand you better.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="John Doe" required />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Education Level</label>
                            <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required>
                                <option value="">Select Level</option>
                                <option value="High School">High School</option>
                                <option value="Associate Degree">Associate Degree</option>
                                <option value="Bachelor Degree">Bachelor Degree</option>
                                <option value="Master Degree">Master Degree</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Skills</label>
                        <textarea name="skills" value={formData.skills} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[100px]" placeholder="e.g., Python, Public Speaking, Project Management..." />
                        <p className="text-xs text-slate-400 mt-1">Separate skills with commas.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Interests</label>
                        <textarea name="interests" value={formData.interests} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[100px]" placeholder="e.g., Technology, Art, Social Work..." />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Personality Traits</label>
                        <input type="text" name="personality_traits" value={formData.personality_traits} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g., Creative, Analytical, Leader" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Career Goals</label>
                        <textarea name="career_goals" value={formData.career_goals} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[100px]" placeholder="Describe your dream job or what you want to achieve..." />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5">
                            {loading ? 'Saving Profile...' : 'Save Profile'}
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-4 p-4 rounded-xl text-center text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;

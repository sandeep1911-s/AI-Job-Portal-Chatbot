import React, { useState, useEffect } from 'react';
import api from '../api';
import { Briefcase, ArrowRight, BookOpen, UserCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [profileExists, setProfileExists] = useState(true);
    const [loading, setLoading] = useState(true);

    // Mock user ID
    const userId = 1;

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const res = await api.get(`/recommendations/${userId}`);
            // Assuming api returns { recommendations: "..." } string or parsed object
            // If the backend returns a string representation of JSON, we might need to parse it.
            // But in ai_service.py we returned text directly.
            // Ideally backend returns JSON. For now let's handle the string.
            // If unexpected, handle gracefully.
            setRecommendations(res.data.recommendations);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setProfileExists(false);
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profileExists) {
        return (
            <div className="text-center py-20">
                <UserCheck size={64} className="mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Missing</h2>
                <p className="text-gray-500 mb-8">Please complete your profile to get career recommendations.</p>
                <Link to="/profile" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold">
                    Create Profile
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Career Dashboard</h2>

            {/* AI Recommendations Section */}
            <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Briefcase className="text-primary" /> AI Recommended Paths
                </h3>

                {/* If recommendations is a string (JSON string) try to parse it, otherwise display as raw text */}
                {/* For this MVP, if it returns raw markdown/text from Gemini, we display it nicely. */}

                <div className="space-y-4">
                    {(() => {
                        let content = recommendations;
                        let parsed = null;

                        try {
                            if (typeof content === 'string') {
                                // Try to clean markdown code blocks if present
                                const jsonString = content.replace(/```json\n?|\n?```/g, '');
                                parsed = JSON.parse(jsonString);
                            } else {
                                parsed = content;
                            }
                        } catch (e) {
                            // If parse fails, display as text
                        }

                        if (parsed && parsed.recommendations && Array.isArray(parsed.recommendations)) {
                            return parsed.recommendations.map((job, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">{typeof job.title === 'string' ? job.title : 'Career Path'}</h4>
                                    <p className="text-gray-600 mb-4">{typeof job.description === 'string' ? job.description : ''}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${(typeof job.skills_match === 'string' && job.skills_match.includes('High')) ? 'bg-green-100 text-green-700' :
                                                (typeof job.skills_match === 'string' && job.skills_match.includes('Medium')) ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            Match: {typeof job.skills_match === 'string' || typeof job.skills_match === 'number' ? job.skills_match : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            ));
                        }

                        // Fallback display
                        let displayContent = recommendations;
                        if (typeof displayContent !== 'string') {
                            displayContent = JSON.stringify(displayContent, null, 2);
                        }

                        return (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose max-w-none">
                                <div className="whitespace-pre-wrap leading-relaxed text-gray-700">{displayContent}</div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                        <BookOpen className="text-secondary" /> Learning Resources
                    </h3>
                    <p className="text-gray-500">
                        Based on your skill gaps, automated course suggestions will appear here.
                        (Coming Soon)
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                        <AlertCircle className="text-orange-500" /> Market Insights
                    </h3>
                    <p className="text-gray-500">
                        Real-time labor market trends and salary insights.
                        (Coming Soon)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

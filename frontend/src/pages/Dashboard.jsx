import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMe, getHistory } from '../services/api';

const tips = [
    "Always request a walkthrough before signing any lease.",
    "Never pay a security deposit before seeing the property in person.",
    "Read every clause in your lease — especially early termination fees.",
    "Check if utilities are included before comparing rent prices.",
    "Research the landlord's name online before committing.",
    "Ask about the building's pest control history before moving in.",
    "Always get move-in condition documented in writing with photos.",
];

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [recentHistory, setRecentHistory] = useState([]);
    const [address, setAddress] = useState('');
    const [lowScoreWarning, setLowScoreWarning] = useState(false);
    const tip = tips[Math.floor(Math.random() * tips.length)];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                localStorage.setItem('userName', response.data.name);
                localStorage.setItem('userEmail', response.data.email);

                const historyResponse = await getHistory(response.data.email);
                const history = historyResponse.data.slice(0, 3);
                setRecentHistory(history);

                // Check if any property has low trust score
                const hasLowScore = history.some(item => item.overallScore < 5);
                setLowScoreWarning(hasLowScore);
            } catch (err) {
                localStorage.clear();
                navigate('/auth');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleQuickAnalyze = () => {
        if (!address.trim()) return;
        navigate(`/analyze?address=${encodeURIComponent(address)}`);
    };

    const getScoreColor = (score) => {
        if (score >= 7) return 'text-emerald-600';
        if (score >= 4) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score) => {
        if (score >= 7) return 'bg-emerald-50 border-emerald-200';
        if (score >= 4) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen text-gray-900" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            <Navbar userEmail={userEmail} />

            <div className="max-w-4xl mx-auto px-8 py-12">

                {/* Welcome */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, <span className="text-emerald-600">{userName}</span> 👋
                    </h2>
                    <p className="text-gray-500 text-sm">Here's what you can do with TenantLens today.</p>
                </div>

                {/* Warning banner */}
                {lowScoreWarning && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-red-600 text-sm font-medium">One of your recent properties has a low trust score. Review it carefully before signing.</p>
                    </div>
                )}

                {/* Quick analyze bar */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                    <p className="text-gray-700 font-semibold mb-3">Quick Analyze</p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Enter a property address..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickAnalyze()}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 text-sm"
                        />
                        <button
                            onClick={handleQuickAnalyze}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition"
                        >
                            Analyze
                        </button>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div
                        onClick={() => navigate('/analyze')}
                        className="bg-white border border-gray-200 p-8 rounded-xl cursor-pointer hover:border-emerald-500 hover:shadow-md transition group"
                    >
                        <div className="text-3xl mb-4">🔎</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition">Analyze a Property</h3>
                        <p className="text-gray-500 text-sm">Enter any address and get a full TenantLens safety, review and rent report.</p>
                        <p className="text-emerald-600 text-sm font-medium mt-4">Get started →</p>
                    </div>

                    <div
                        onClick={() => navigate('/history')}
                        className="bg-white border border-gray-200 p-8 rounded-xl cursor-pointer hover:border-emerald-500 hover:shadow-md transition group"
                    >
                        <div className="text-3xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition">View Search History</h3>
                        <p className="text-gray-500 text-sm">See all your previously analyzed properties and their trust scores.</p>
                        <p className="text-emerald-600 text-sm font-medium mt-4">View history →</p>
                    </div>
                </div>

                {/* Recent searches */}
                {recentHistory.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
                        <div className="flex flex-col gap-3">
                            {recentHistory.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-400 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-gray-900 font-medium text-sm">{item.address}</p>
                                            <p className="text-gray-400 text-xs mt-1">{new Date(item.searchedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className={`text-center border rounded-lg p-2 ${getScoreBg(item.safetyScore)}`}>
                                            <p className={`text-lg font-bold ${getScoreColor(item.safetyScore)}`}>{item.safetyScore}</p>
                                            <p className="text-gray-500 text-xs">Safety</p>
                                        </div>
                                        <div className={`text-center border rounded-lg p-2 ${getScoreBg(item.reviewScore)}`}>
                                            <p className={`text-lg font-bold ${getScoreColor(item.reviewScore)}`}>{item.reviewScore}</p>
                                            <p className="text-gray-500 text-xs">Reviews</p>
                                        </div>
                                        <div className={`text-center border rounded-lg p-2 ${getScoreBg(item.rentScore)}`}>
                                            <p className={`text-lg font-bold ${getScoreColor(item.rentScore)}`}>{item.rentScore}</p>
                                            <p className="text-gray-500 text-xs">Rent</p>
                                        </div>
                                        <div className={`text-center border rounded-lg p-2 ${getScoreBg(item.overallScore)}`}>
                                            <p className={`text-lg font-bold ${getScoreColor(item.overallScore)}`}>{item.overallScore}</p>
                                            <p className="text-gray-500 text-xs">Overall</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tip of the day */}
                <div className="bg-white border border-emerald-200 rounded-xl p-5 flex gap-4 items-start">
                    <span className="text-2xl">💡</span>
                    <div>
                        <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide mb-1">Renter Tip of the Day</p>
                        <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getHistory } from '../services/api';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getHistory(userEmail);
                setHistory(response.data);
            } catch (err) {
                console.error('Failed to fetch history');
            }
            setLoading(false);
        };
        fetchHistory();
    }, [userEmail]);

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

    // Get trend arrow by comparing current item with previous same address
    const getTrend = (currentItem, index) => {
        const previousItem = history.slice(index + 1).find(
            (item) => item.address.toLowerCase() === currentItem.address.toLowerCase()
        );
        if (!previousItem) return null;
        if (currentItem.overallScore > previousItem.overallScore) return { arrow: '↑', color: 'text-emerald-600', label: 'Improved' };
        if (currentItem.overallScore < previousItem.overallScore) return { arrow: '↓', color: 'text-red-500', label: 'Declined' };
        return { arrow: '→', color: 'text-gray-400', label: 'No change' };
    };

    return (
        <div className="min-h-screen text-gray-900 flex flex-col" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            <Navbar userEmail={userEmail} />

            <div className="max-w-4xl mx-auto px-8 py-12 flex-1 w-full">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">Search History</h2>
                    <p className="text-gray-500 text-sm">All your previously analyzed properties.</p>
                </div>

                {loading && <p className="text-gray-400">Loading...</p>}

                {!loading && history.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="text-gray-500 text-sm">No properties analyzed yet. Go analyze your first property!</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {history.map((item, index) => {
                        const trend = getTrend(item, index);
                        return (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-400 transition">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-900 font-semibold">{item.address}</p>
                                        <p className="text-gray-400 text-xs mt-1">{new Date(item.searchedAt).toLocaleString()}</p>
                                    </div>
                                    {trend && (
                                        <div className={`flex items-center gap-1 text-sm font-semibold ${trend.color}`}>
                                            <span className="text-lg">{trend.arrow}</span>
                                            <span className="text-xs">{trend.label}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Score cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Safety', score: item.safetyScore },
                                        { label: 'Reviews', score: item.reviewScore },
                                        { label: 'Rent', score: item.rentScore },
                                        { label: 'Overall', score: item.overallScore },
                                    ].map((s) => (
                                        <div key={s.label} className={`text-center border rounded-xl p-3 ${getScoreBg(s.score)}`}>
                                            <p className={`text-xl font-bold ${getScoreColor(s.score)}`}>{s.score}</p>
                                            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-12 py-5 flex justify-center items-center gap-4">
                <h2 className="text-emerald-600 font-bold text-lg">TenantLens</h2>
                <span className="text-gray-300">|</span>
                <p className="text-gray-500 text-sm">Rent Smart. Stay Protected. Powered by AI.</p>
                <span className="text-gray-300">|</span>
                <p className="text-xs text-gray-400">© 2026 TenantLens</p>
            </footer>
        </div>
    );
}

export default History;
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getHistory } from '../services/api';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');

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

    const handleDelete = (id) => {
        setHistory(history.filter(item => item.id !== id));
    };

    const handleExportCSV = () => {
        const headers = 'Address,Safety,Reviews,Rent,Overall,Date\n';
        const rows = history.map(item =>
            `"${item.address}",${item.safetyScore},${item.reviewScore},${item.rentScore},${item.overallScore},"${new Date(item.searchedAt).toLocaleString()}"`
        ).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tenantlens-history.csv';
        a.click();
    };

    // Filter and sort inline
    let displayHistory = [...history];
    if (search.trim()) {
        displayHistory = displayHistory.filter(item =>
            item.address.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (sortBy === 'newest') displayHistory.sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt));
    if (sortBy === 'oldest') displayHistory.sort((a, b) => new Date(a.searchedAt) - new Date(b.searchedAt));
    if (sortBy === 'highest') displayHistory.sort((a, b) => b.overallScore - a.overallScore);
    if (sortBy === 'lowest') displayHistory.sort((a, b) => a.overallScore - b.overallScore);

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

    const getTrend = (currentItem, index) => {
        const previousItem = history.slice(index + 1).find(
            (item) => item.address.toLowerCase() === currentItem.address.toLowerCase()
        );
        if (!previousItem) return null;
        if (currentItem.overallScore > previousItem.overallScore) return { arrow: '↑', color: 'text-emerald-600', label: 'Improved' };
        if (currentItem.overallScore < previousItem.overallScore) return { arrow: '↓', color: 'text-red-500', label: 'Declined' };
        return { arrow: '→', color: 'text-gray-400', label: 'No change' };
    };

    const avgScore = history.length > 0
        ? (history.reduce((sum, item) => sum + item.overallScore, 0) / history.length).toFixed(1)
        : null;

    const safest = history.length > 0
        ? history.reduce((best, item) => item.overallScore > best.overallScore ? item : best, history[0])
        : null;

    return (
        <div className="min-h-screen text-gray-900 flex flex-col" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            <Navbar userEmail={userEmail} />

            <div className="max-w-4xl mx-auto px-8 py-12 flex-1 w-full">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">Search History</h2>
                    <p className="text-gray-500 text-sm">All your previously analyzed properties.</p>
                </div>

                {/* Summary stats */}
                {history.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-emerald-600">{history.length}</p>
                            <p className="text-gray-500 text-xs mt-1">Properties Analyzed</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-600">{avgScore}</p>
                            <p className="text-gray-500 text-xs mt-1">Average Trust Score</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-600 truncate">{safest?.address}</p>
                            <p className="text-gray-500 text-xs mt-1">Safest Property</p>
                        </div>
                    </div>
                )}

                {/* Search + Sort + Export */}
                {history.length > 0 && (
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Search by address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest Score</option>
                            <option value="lowest">Lowest Score</option>
                        </select>
                        <button
                            onClick={handleExportCSV}
                            className="bg-white border border-gray-200 hover:border-emerald-400 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            📥 Export CSV
                        </button>
                    </div>
                )}

                {loading && <p className="text-gray-400">Loading...</p>}

                {!loading && history.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="text-gray-500 text-sm">No properties analyzed yet. Go analyze your first property!</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {displayHistory.map((item) => {
                        const trend = getTrend(item, history.indexOf(item));
                        return (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-400 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-900 font-semibold">{item.address}</p>
                                        <p className="text-gray-400 text-xs mt-1">{new Date(item.searchedAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {trend && (
                                            <div className={`flex items-center gap-1 text-sm font-semibold ${trend.color}`}>
                                                <span className="text-lg">{trend.arrow}</span>
                                                <span className="text-xs">{trend.label}</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-300 hover:text-red-400 transition text-lg"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

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
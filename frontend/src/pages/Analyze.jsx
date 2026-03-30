import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { analyzeProperty } from '../services/api';

function Analyze() {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    const userEmail = localStorage.getItem('userEmail');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlAddress = params.get('address');
        if (urlAddress) {
            setAddress(urlAddress);
        }
    }, [location.search]);

    const handleAnalyze = async () => {
        if (!address.trim()) {
            setError('Please enter an address');
            return;
        }
        setError('');
        setLoading(true);
        setResult(null);
        try {
            const response = await analyzeProperty({ address, userEmail });
            setResult(response.data);
        } catch (err) {
            setError('Failed to analyze property. Please try again.');
        }
        setLoading(false);
    };

    const handleCopyReport = () => {
        if (!result) return;
        const text = `TenantLens Report for ${result.address}\n\nSafety: ${result.safetyScore}/10\nReviews: ${result.reviewScore}/10\nRent: ${result.rentScore}/10\nOverall: ${result.overallScore}/10\n\nAI Report:\n${result.aiReport}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setResult(null);
        setAddress('');
        setError('');
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

    const getScoreLabel = (score) => {
        if (score >= 7) return 'Good';
        if (score >= 4) return 'Moderate';
        return 'Poor';
    };

    const getRecommendation = (score) => {
        if (score >= 7) return { icon: '✅', text: 'This property looks safe to rent.', bg: 'bg-emerald-50 border-emerald-200', color: 'text-emerald-700' };
        if (score >= 4) return { icon: '⚠️', text: 'Proceed with caution — review the details carefully.', bg: 'bg-yellow-50 border-yellow-200', color: 'text-yellow-700' };
        return { icon: '❌', text: 'We recommend avoiding this property.', bg: 'bg-red-50 border-red-200', color: 'text-red-700' };
    };

    const tooltipText = {
        Safety: 'Based on crime rates and public complaint data in this area.',
        Reviews: 'Based on NLP analysis of landlord and listing review patterns.',
        Rent: 'Based on rent price trends and manipulation detection in this area.',
        Overall: 'Combined average of all three scores.',
    };

    const recommendation = result ? getRecommendation(result.overallScore) : null;

    return (
        <div className="min-h-screen text-gray-900" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            <Navbar userEmail={userEmail} />

            <div className="flex gap-6 px-8 py-8 w-full">

                {/* Left panel - search and results */}
                <div className="w-1/2 flex flex-col gap-6">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">Analyze a Property</h2>
                        <p className="text-gray-500 text-sm">Enter an address to get a full TenantLens safety report.</p>
                    </div>

                    {/* Search bar */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="e.g. 123 Main Street, Syracuse, NY"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition"
                            >
                                {loading ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {loading && (
                        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                            <p className="text-emerald-600 font-medium mb-2">Running AI analysis...</p>
                            <p className="text-gray-400 text-sm">Checking safety, reviews and rent data.</p>
                        </div>
                    )}

                    {result && (
                        <div className="flex flex-col gap-4">

                            {/* Recommendation banner */}
                            <div className={`border rounded-xl p-4 flex items-center gap-3 ${recommendation.bg}`}>
                                <span className="text-xl">{recommendation.icon}</span>
                                <p className={`text-sm font-medium ${recommendation.color}`}>{recommendation.text}</p>
                            </div>

                            {/* Score cards */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">{result.address}</h3>
                                <p className="text-gray-400 text-xs mb-5">TenantLens Analysis Report</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                    {[
                                        { label: 'Safety', score: result.safetyScore },
                                        { label: 'Reviews', score: result.reviewScore },
                                        { label: 'Rent', score: result.rentScore },
                                        { label: 'Overall', score: result.overallScore },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className={`text-center border rounded-xl p-4 cursor-pointer relative ${getScoreBg(item.score)}`}
                                            onMouseEnter={() => setTooltip(item.label)}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            <p className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                                            <p className="text-gray-500 text-xs mt-1">{item.label}</p>
                                            <p className={`text-xs font-medium mt-1 ${getScoreColor(item.score)}`}>{getScoreLabel(item.score)}</p>
                                            {tooltip === item.label && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-48 z-10">
                                                    {tooltipText[item.label]}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* AI Report */}
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">AI Report</p>
                                    <p className="text-gray-700 text-sm leading-relaxed">{result.aiReport}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopyReport}
                                    className="flex-1 bg-white border border-gray-200 hover:border-emerald-400 text-gray-600 py-2.5 rounded-lg text-sm font-medium transition"
                                >
                                    {copied ? '✅ Copied!' : '📋 Copy Report'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
                                >
                                    🔎 Analyze Another Property
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right panel - map */}
                <div className="w-1/2 flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-24">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-700">📍 Property Location</p>
                            <p className="text-xs text-gray-400 mt-0.5">Approximate location based on address</p>
                        </div>
                        <iframe
                            title="Property Map"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=-76.2474%2C42.9481%2C-76.0474%2C43.1481&layer=mapnik"
                            width="100%"
                            style={{ border: 'none', height: 'calc(100vh - 130px)' }}
                        />
                    </div>
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

export default Analyze;
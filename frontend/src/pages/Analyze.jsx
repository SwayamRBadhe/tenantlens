import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { analyzeProperty } from '../services/api';

function Analyze() {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userEmail = localStorage.getItem('userEmail');

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

    const getScoreColor = (score) => {
        if (score >= 7) return 'text-emerald-400';
        if (score >= 4) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 7) return 'border-emerald-700';
        if (score >= 4) return 'border-yellow-700';
        return 'border-red-700';
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar userEmail={userEmail} />
            <div className="px-12 py-12 max-w-3xl">
                <h2 className="text-3xl font-bold mb-1">Analyze a Property</h2>
                <p className="text-gray-400 mb-8">Enter an address to get a full TenantLens safety report.</p>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="e.g. 123 Main Street, Syracuse, NY"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {loading && (
                    <div className="text-gray-400 text-sm">Running AI analysis, please wait...</div>
                )}

                {result && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-6 text-white">{result.address}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className={`text-center bg-gray-950 border rounded-xl p-4 ${getScoreBg(result.safetyScore)}`}>
                                <p className="text-gray-400 text-xs mb-1">Safety</p>
                                <p className={`text-2xl font-bold ${getScoreColor(result.safetyScore)}`}>{result.safetyScore}</p>
                                <p className="text-gray-600 text-xs">/10</p>
                            </div>
                            <div className={`text-center bg-gray-950 border rounded-xl p-4 ${getScoreBg(result.reviewScore)}`}>
                                <p className="text-gray-400 text-xs mb-1">Reviews</p>
                                <p className={`text-2xl font-bold ${getScoreColor(result.reviewScore)}`}>{result.reviewScore}</p>
                                <p className="text-gray-600 text-xs">/10</p>
                            </div>
                            <div className={`text-center bg-gray-950 border rounded-xl p-4 ${getScoreBg(result.rentScore)}`}>
                                <p className="text-gray-400 text-xs mb-1">Rent</p>
                                <p className={`text-2xl font-bold ${getScoreColor(result.rentScore)}`}>{result.rentScore}</p>
                                <p className="text-gray-600 text-xs">/10</p>
                            </div>
                            <div className={`text-center bg-gray-950 border rounded-xl p-4 ${getScoreBg(result.overallScore)}`}>
                                <p className="text-gray-400 text-xs mb-1">Overall</p>
                                <p className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</p>
                                <p className="text-gray-600 text-xs">/10</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-4">
                            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">AI Report</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{result.aiReport}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analyze;
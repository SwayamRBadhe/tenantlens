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
        if (score >= 7) return 'text-green-400';
        if (score >= 4) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar userEmail={userEmail} />
            <div className="px-12 py-12">
                <h2 className="text-3xl font-bold mb-2">Search History</h2>
                <p className="text-gray-400 mb-8">Your previously analyzed properties.</p>

                {loading && <p className="text-gray-400">Loading...</p>}

                {!loading && history.length === 0 && (
                    <p className="text-gray-400">No properties analyzed yet.</p>
                )}

                <div className="flex flex-col gap-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-blue-400 font-semibold mb-4">{item.address}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-1">Safety</p>
                                    <p className={`text-xl font-bold ${getScoreColor(item.safetyScore)}`}>{item.safetyScore}/10</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-1">Reviews</p>
                                    <p className={`text-xl font-bold ${getScoreColor(item.reviewScore)}`}>{item.reviewScore}/10</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-1">Rent</p>
                                    <p className={`text-xl font-bold ${getScoreColor(item.rentScore)}`}>{item.rentScore}/10</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-1">Overall</p>
                                    <p className={`text-xl font-bold ${getScoreColor(item.overallScore)}`}>{item.overallScore}/10</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs">{new Date(item.searchedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default History;
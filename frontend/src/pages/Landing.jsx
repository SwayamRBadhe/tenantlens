import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-800">
                <h1 className="text-xl font-bold text-blue-400">TenantLens</h1>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-24">
                <h2 className="text-5xl font-bold mb-6">
                    Rent Smart. <span className="text-blue-400">Stay Protected.</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mb-10">
                    TenantLens uses AI to detect fake reviews, rent price manipulation,
                    and neighborhood safety risks — before you sign a lease.
                </p>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold"
                >
                    Analyze a Property
                </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-24">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-blue-400 text-lg font-semibold mb-2">Neighborhood Safety</h3>
                    <p className="text-gray-400 text-sm">Get a safety score based on crime and complaint data for any address.</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-blue-400 text-lg font-semibold mb-2">Fake Review Detection</h3>
                    <p className="text-gray-400 text-sm">Our NLP model detects suspicious review patterns to protect you from misleading listings.</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-blue-400 text-lg font-semibold mb-2">Rent Manipulation</h3>
                    <p className="text-gray-400 text-sm">Detect if landlords in your area are artificially inflating rent prices.</p>
                </div>
            </div>
        </div>
    );
}

export default Landing;
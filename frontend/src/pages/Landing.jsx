import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-gray-900" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            {/* Navbar */}
            <nav className="px-8 py-5 flex justify-between items-center bg-white border-b border-gray-200 sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-emerald-600">TenantLens</h1>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section with subtle gradient */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-16">
                <span className="text-emerald-600 text-base font-medium tracking-widest uppercase mb-4">AI-Powered Renter Protection</span>
                <h2 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
                    Rent Smart. <span className="text-emerald-600">Stay Protected.</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-xl mb-10">
                    TenantLens uses AI to detect fake reviews, rent price manipulation,
                    and neighborhood safety risks — before you sign a lease.
                </p>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-lg text-lg font-semibold"
                >
                    Analyze a Property
                </button>

                {/* Stats inside hero */}
                <div className="flex gap-12 mt-12 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-gray-500 text-sm">AI Models</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">10,000+</p>
                        <p className="text-gray-500 text-sm">Properties Analyzed</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">Real-time</p>
                        <p className="text-gray-500 text-sm">AI Reports</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">Free</p>
                        <p className="text-gray-500 text-sm">To Use</p>
                    </div>
                </div>
            </div>



            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 py-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-400 transition shadow-sm text-center">
                    <div className="text-emerald-600 text-3xl mb-3">🛡️</div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">Neighborhood Safety</h3>
                    <p className="text-gray-500 text-sm">Get a safety score based on crime and complaint data for any address.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-400 transition shadow-sm text-center">
                    <div className="text-emerald-600 text-3xl mb-3">🔍</div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">Fake Review Detection</h3>
                    <p className="text-gray-500 text-sm">Our NLP model detects suspicious review patterns to protect you from misleading listings.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-400 transition shadow-sm text-center">
                    <div className="text-emerald-600 text-3xl mb-3">💰</div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">Rent Manipulation</h3>
                    <p className="text-gray-500 text-sm">Detect if landlords in your area are artificially inflating rent prices.</p>
                </div>
            </div>

            {/* How it works */}
            <div className="px-12 py-16">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                    <div>
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                        <h4 className="text-gray-900 font-semibold mb-2">Enter an Address</h4>
                        <p className="text-gray-500 text-sm">Type in any property address you are considering renting.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                        <h4 className="text-gray-900 font-semibold mb-2">AI Analyzes</h4>
                        <p className="text-gray-500 text-sm">Our AI models check safety, reviews, and rent fairness in seconds.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                        <h4 className="text-gray-900 font-semibold mb-2">Get Your Report</h4>
                        <p className="text-gray-500 text-sm">Receive a clear trust score and AI-generated report to make an informed decision.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="px-12 py-16 text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to protect yourself as a renter?</h3>
                <p className="text-gray-500 mb-8">Start for free — no credit card required.</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-lg text-lg font-semibold"
                >
                    Get Started Free
                </button>
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

export default Landing;
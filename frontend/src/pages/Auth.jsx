import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSwitch = () => {
        setIsLogin(!isLogin);
        setError('');
        setForm({ name: '', email: '', password: '' });
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            let response;
            if (isLogin) {
                response = await login({ email: form.email, password: form.password });
            } else {
                response = await register({ name: form.name, email: form.email, password: form.password });
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userName', response.data.name);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    const loginFacts = [
        { icon: '🏚️', title: 'Fake reviews are everywhere', desc: 'Over 30% of apartment reviews online are estimated to be fake or incentivized by landlords to attract tenants.' },
        { icon: '📈', title: 'Rent price coordination is real', desc: 'Landlords in the same zip code often raise prices together, making it nearly impossible for renters to find a fair deal.' },
        { icon: '🔍', title: 'Most renters sign blind', desc: '9 out of 10 renters sign a lease without checking neighborhood safety data or verifying listing authenticity.' },
    ];

    const registerFacts = [
        { icon: '🛡️', title: 'Safety data saves money', desc: 'Renters who research neighborhood safety before signing save an average of $3,000 in unexpected moving costs.' },
        { icon: '📋', title: 'Read your lease carefully', desc: 'Hidden clauses like early termination fees and maintenance liability cost renters billions of dollars every year.' },
        { icon: '💡', title: 'AI can protect you', desc: 'AI-powered tools can detect suspicious patterns in listings and reviews that the human eye would easily miss.' },
    ];

    const facts = isLogin ? loginFacts : registerFacts;

    const FormPanel = (
        <div className="w-1/2 flex flex-col justify-center px-16 py-16 bg-white"
            style={{ minHeight: 'calc(100vh - 128px)' }}>

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-gray-400 text-sm">
                    {isLogin ? 'Login to your TenantLens account' : 'Start protecting yourself as a renter'}
                </p>
                <p className="text-emerald-500 text-xs mt-1 font-medium">Rent Smart. Stay Protected.</p>
            </div>

            {!isLogin && (
                <div className="relative mb-4">
                    <MdPerson className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                    <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500" />
                </div>
            )}

            <div className="relative mb-4">
                <MdEmail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500" />
            </div>

            <div className="relative mb-6">
                <MdLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500" />
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold mb-4 transition">
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>

            <p className="text-center text-gray-400 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <span onClick={handleSwitch} className="text-emerald-600 cursor-pointer ml-1 hover:underline font-medium">
                    {isLogin ? 'Register' : 'Login'}
                </span>
            </p>
        </div>
    );

    const InfoPanel = (
        <div className="w-1/2 flex flex-col justify-center items-center px-16 py-16 text-center"
            style={{ background: 'linear-gradient(135deg, #f7fffe 0%, #ecfdf5 60%, #f0fdf4 100%)', minHeight: 'calc(100vh - 128px)' }}>

            <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest mb-8">Did you know?</p>

            <div className="flex flex-col gap-4 mb-10 w-full">
                {facts.map((fact, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm text-center">
                        <p className="text-2xl mb-2">{fact.icon}</p>
                        <p className="text-gray-800 text-sm font-semibold mb-1">{fact.title}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{fact.desc}</p>
                    </div>
                ))}
            </div>

            <p className="text-gray-500 text-sm mb-4">
                {isLogin ? 'New to TenantLens?' : 'Already have an account?'}
            </p>
            <button onClick={handleSwitch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                {isLogin ? 'Create Free Account' : 'Login'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="px-8 py-5 flex justify-between items-center bg-white border-b border-gray-200 sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>TenantLens</h1>
            </nav>

            <div className="flex flex-1">
                {/* Vertical divider */}
                {isLogin ? (
                    <>
                        {FormPanel}
                        <div className="w-px bg-gray-200" />
                        {InfoPanel}
                    </>
                ) : (
                    <>
                        {InfoPanel}
                        <div className="w-px bg-gray-200" />
                        {FormPanel}
                    </>
                )}
            </div>

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

export default Auth;
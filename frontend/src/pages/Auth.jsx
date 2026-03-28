import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    return (
        <div className="min-h-screen text-gray-900 flex flex-col" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 50%, #ecfdf5 100%)' }}>
            
            {/* Navbar */}
            <nav className="px-8 py-5 flex justify-between items-center bg-white border-b border-gray-200 sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>TenantLens</h1>
            </nav>

            {/* Auth Card */}
            <div className="flex flex-1 items-center justify-center py-12">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-8">
                        {isLogin ? 'Login to your TenantLens account' : 'Start protecting yourself as a renter'}
                    </p>

                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 text-gray-900 focus:outline-none focus:border-emerald-500"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 text-gray-900 focus:outline-none focus:border-emerald-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 text-gray-900 focus:outline-none focus:border-emerald-500"
                    />

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold mb-4"
                    >
                        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-emerald-600 cursor-pointer ml-1 hover:underline font-medium"
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;
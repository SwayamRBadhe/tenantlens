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
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
                    {isLogin ? 'Login to TenantLens' : 'Create Account'}
                </h2>

                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 mb-4 text-white focus:outline-none focus:border-blue-500"
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 mb-4 text-white focus:outline-none focus:border-blue-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 mb-4 text-white focus:outline-none focus:border-blue-500"
                />

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold mb-4"
                >
                    {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 cursor-pointer ml-1"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ userEmail }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navigate('/auth');
    };

    const navItem = (label, path) => {
        const isActive = location.pathname === path;
        return (
            <span
                onClick={() => navigate(path)}
                className={`cursor-pointer text-sm font-medium transition px-3 py-1.5 rounded-lg ${
                    isActive
                        ? 'text-emerald-600 font-semibold'
                        : 'text-gray-500 hover:text-emerald-600'
                }`}
            >
                {label}
            </span>
        );
    };

    return (
        <nav className="bg-white text-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
            <h1 className="text-2xl font-bold text-emerald-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
                TenantLens
            </h1>
            <div className="flex gap-3 items-center">
                {navItem('Dashboard', '/dashboard')}
                {navItem('Analyze', '/analyze')}
                {navItem('History', '/history')}
                <span className="text-gray-400 text-sm ml-2">{userEmail}</span>
                <button onClick={handleLogout} className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 transition ml-2">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
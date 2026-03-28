import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ userEmail }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navigate('/auth');
    };

    return (
        <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center border-b border-gray-800">
            <h1 className="text-xl font-bold text-emerald-400 cursor-pointer" onClick={() => navigate('/dashboard')}>
                TenantLens
            </h1>
            <div className="flex gap-6 items-center">
                <span className="cursor-pointer text-gray-400 hover:text-emerald-400 transition" onClick={() => navigate('/analyze')}>Analyze</span>
                <span className="cursor-pointer text-gray-400 hover:text-emerald-400 transition" onClick={() => navigate('/history')}>History</span>
                <span className="text-gray-500 text-sm">{userEmail}</span>
                <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1 rounded-lg text-sm text-gray-300">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
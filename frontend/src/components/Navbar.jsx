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
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-400 cursor-pointer" onClick={() => navigate('/dashboard')}>
                TenantLens
            </h1>
            <div className="flex gap-6 items-center">
                <span className="cursor-pointer hover:text-blue-400" onClick={() => navigate('/analyze')}>Analyze</span>
                <span className="cursor-pointer hover:text-blue-400" onClick={() => navigate('/history')}>History</span>
                <span className="text-gray-400 text-sm">{userEmail}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
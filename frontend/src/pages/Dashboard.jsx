import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMe } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                localStorage.setItem('userName', response.data.name);
                localStorage.setItem('userEmail', response.data.email);
            } catch (err) {
                localStorage.clear();
                navigate('/auth');
            }
        };
        fetchUser();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar userEmail={userEmail} />
            <div className="px-12 py-12">
                <h2 className="text-3xl font-bold mb-1">Welcome back, <span className="text-emerald-400">{userName}</span> 👋</h2>
                <p className="text-gray-400 mb-10">What would you like to do today?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div
                        onClick={() => navigate('/analyze')}
                        className="bg-gray-900 border border-gray-800 p-6 rounded-xl cursor-pointer hover:border-emerald-500 transition"
                    >
                        <div className="text-emerald-400 text-2xl mb-3">🔎</div>
                        <h3 className="text-white text-lg font-semibold mb-2">Analyze a Property</h3>
                        <p className="text-gray-400 text-sm">Enter an address and get a full TenantLens report.</p>
                    </div>
                    <div
                        onClick={() => navigate('/history')}
                        className="bg-gray-900 border border-gray-800 p-6 rounded-xl cursor-pointer hover:border-emerald-500 transition"
                    >
                        <div className="text-emerald-400 text-2xl mb-3">📋</div>
                        <h3 className="text-white text-lg font-semibold mb-2">View Search History</h3>
                        <p className="text-gray-400 text-sm">See all your previously analyzed properties.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
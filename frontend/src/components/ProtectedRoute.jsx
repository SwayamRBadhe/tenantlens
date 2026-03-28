import React from 'react';
import { Navigate } from 'react-router-dom';

// If no token found, redirect to auth page
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth" />;
    }

    return children;
}

export default ProtectedRoute;
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getMe } from '../../redux/slices/authSlice';

const PrivateRoute = ({ children, requiredRole = null }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated && !isLoading) {
            dispatch(getMe());
        }
    }, [dispatch, isAuthenticated, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with return URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if specific role is required
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect based on user role
        if (user?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
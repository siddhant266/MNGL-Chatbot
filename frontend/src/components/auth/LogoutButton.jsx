import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, manualLogout } from '../../redux/slices/authSlice';

const LogoutButton = ({ children, className = '' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            // Call the logout API
            await dispatch(logout()).unwrap();

            // Navigate to login page
            navigate('/login');

            // Force a page reload to clear any cached state
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);

            // Even if API fails, clear local state and redirect
            dispatch(manualLogout());
            navigate('/login');
            window.location.reload();
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? 'Logging out...' : (children || 'Logout')}
        </button>
    );
};

export default LogoutButton;
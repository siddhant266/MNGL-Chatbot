import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user data from Redux store
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            // Clear Redux state first
            dispatch(logout());

            // Clear all localStorage items
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userData');

            // Clear sessionStorage
            sessionStorage.clear();

            // Force hard redirect to login page
            window.location.href = '/login';

            // Optional: Force reload to clear any cached state
            // window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);

            // Even if API fails, clear everything and redirect
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* User Info and Logout Button */}
                            {isAuthenticated && user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Logging out...' : 'Logout'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                        <div className="flex flex-col items-center justify-center h-full p-4">
                            {/* Welcome Message */}
                            {isAuthenticated && user ? (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Welcome back, {user.name}!
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        You are logged in as {user.role}
                                    </p>

                                    {/* User Information */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm max-w-md w-full">
                                        <h3 className="font-semibold text-lg mb-3">Your Profile</h3>
                                        <div className="space-y-2">
                                            <div className="flex">
                                                <span className="font-medium w-32">Email:</span>
                                                <span className="text-gray-700">{user.email}</span>
                                            </div>
                                            {user.contactNumber && (
                                                <div className="flex">
                                                    <span className="font-medium w-32">Contact:</span>
                                                    <span className="text-gray-700">{user.contactNumber}</span>
                                                </div>
                                            )}
                                            {user.bpNumber && (
                                                <div className="flex">
                                                    <span className="font-medium w-32">BP Number:</span>
                                                    <span className="text-gray-700">{user.bpNumber}</span>
                                                </div>
                                            )}
                                            <div className="flex">
                                                <span className="font-medium w-32">Status:</span>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-lg mb-4">Welcome to your dashboard!</p>
                                    <div className="text-center">
                                        <p className="text-gray-600 mb-4">Please login to access your account</p>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Go to Login Page
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
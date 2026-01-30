import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
// Heroicons v2 imports - updated structure
import {
    UsersIcon,
    ChartBarIcon,
    Cog6ToothIcon as CogIcon,
    BellIcon,
    MagnifyingGlassIcon as SearchIcon,
    ChevronDownIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CalendarDaysIcon as CalendarIcon,
    ShieldCheckIcon,
    ExclamationCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', bpNumber: 'MNGL-2023-12345', joinDate: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', bpNumber: 'MNGL-2023-12346', joinDate: '2023-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', status: 'active', bpNumber: 'MNGL-2023-12347', joinDate: '2023-03-10' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'inactive', bpNumber: 'MNGL-2023-12348', joinDate: '2023-04-05' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', bpNumber: 'MNGL-2023-12349', joinDate: '2023-05-12' },
    ]);

    const [stats, setStats] = useState({
        totalUsers: 1254,
        activeUsers: 1189,
        newUsers: 42,
        inactiveUsers: 65,
        growthRate: 3.2,
        todayLogins: 289
    });

    const [recentActivities, setRecentActivities] = useState([
        { id: 1, user: 'John Doe', action: 'Account created', time: '2 minutes ago', type: 'success' },
        { id: 2, user: 'Jane Smith', action: 'Password changed', time: '15 minutes ago', type: 'info' },
        { id: 3, user: 'Admin User', action: 'User role updated', time: '1 hour ago', type: 'warning' },
        { id: 4, user: 'System', action: 'Server maintenance', time: '2 hours ago', type: 'info' },
        { id: 5, user: 'Bob Johnson', action: 'Failed login attempt', time: '3 hours ago', type: 'error' },
    ]);

    useEffect(() => {
        // Check if user is admin
        if (user && user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

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
    
    const toggleUserStatus = (userId) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    const deleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bpNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const StatsCard = ({ title, value, change, icon: Icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold mt-2">{value.toLocaleString()}</p>
                    {change && (
                        <div className={`flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                            <span className="text-sm font-medium">{Math.abs(change)}% from last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`${activeTab === 'dashboard'
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`${activeTab === 'users'
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <UserGroupIcon className="w-5 h-5 mr-2" />
                                    Users
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className={`${activeTab === 'reports'
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                    Reports
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`${activeTab === 'settings'
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <CogIcon className="w-5 h-5 mr-2" />
                                    Settings
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Search, Notifications, User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 focus:outline-none"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                                    </div>
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Switch to User View
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}!</h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your platform today.</p>
                </div>

                {/* Stats Grid */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Users"
                                value={stats.totalUsers}
                                change={stats.growthRate}
                                icon={UserGroupIcon}
                                color="bg-blue-500"
                            />
                            <StatsCard
                                title="Active Users"
                                value={stats.activeUsers}
                                icon={CheckCircleIcon}
                                color="bg-green-500"
                            />
                            <StatsCard
                                title="New Users (Today)"
                                value={stats.newUsers}
                                icon={ArrowUpIcon}
                                color="bg-purple-500"
                            />
                            <StatsCard
                                title="Today's Logins"
                                value={stats.todayLogins}
                                icon={UsersIcon}
                                color="bg-orange-500"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${activity.type === 'success' ? 'bg-green-100' :
                                                    activity.type === 'error' ? 'bg-red-100' :
                                                        activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                                }`}>
                                                {activity.type === 'error' ? (
                                                    <ExclamationCircleIcon className={`h-5 w-5 ${activity.type === 'success' ? 'text-green-600' :
                                                            activity.type === 'error' ? 'text-red-600' :
                                                                activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                                        }`} />
                                                ) : (
                                                    <CheckCircleIcon className={`h-5 w-5 ${activity.type === 'success' ? 'text-green-600' :
                                                            activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                                        }`} />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                                <p className="text-sm text-gray-500">{activity.action}</p>
                                            </div>
                                            <div className="ml-auto text-sm text-gray-500">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Users Management */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    + Add New User
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            BP Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="font-medium text-blue-600">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.bpNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.joinDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => console.log('View user', user.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => console.log('Edit user', user.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleUserStatus(user.id)}
                                                        className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                                                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {user.status === 'active' ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-md font-medium text-gray-900 mb-4">System Preferences</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                                                <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">User Registration</p>
                                                <p className="text-sm text-gray-500">Allow new users to register</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Notifications</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="email-notifications"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-900">
                                                Email notifications
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="system-alerts"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="system-alerts" className="ml-2 text-sm text-gray-900">
                                                System alerts
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Danger Zone</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-800 mb-3">These actions are irreversible. Please proceed with caution.</p>
                                        <div className="space-y-3">
                                            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                Clear All User Data
                                            </button>
                                            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                Reset System Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-medium text-gray-900 mb-4">User Growth</h4>
                                    <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                                        <ChartBarIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Activity Distribution</h4>
                                    <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                                        <CalendarIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Generate Monthly Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            &copy; 2024 Admin Panel. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
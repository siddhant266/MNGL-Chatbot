import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileUpdateModal from './ProfileUpdateModal';

function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (updates) => {
    await updateProfile(updates);
    setIsUpdateModalOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">MNGL Portal</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="btn-secondary"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Welcome Card */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to Maharashtra Natural Gas Limited portal. Manage your account, 
                  view consumption, and access services.
                </p>
              </div>

              {/* User Info Card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact Number:</span>
                    <span className="font-medium">{user.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">BP Number:</span>
                    <span className="font-medium text-primary-600">{user.bpNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="btn-secondary py-4">
                    View Consumption History
                  </button>
                  <button className="btn-secondary py-4">
                    Pay Bill Online
                  </button>
                  <button 
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="btn-secondary py-4"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-gray-500">Welcome to MNGL</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">BP Number Assigned</p>
                      <p className="text-sm text-gray-500">{user.bpNumber}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </>
  );
}

export default Dashboard;
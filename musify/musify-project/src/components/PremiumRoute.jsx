import React from 'react';
import { useAuth } from '../Contex/AuthContex';
import { useSubscription } from '../Contex/SubscriptionContext';

const PremiumRoute = ({ children }) => {
  const { authUser } = useAuth();
  const { userData, loading } = useSubscription();

  // Show loading while fetching user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to access this content.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Allow access if user is Premium OR Admin
  if (userData.subscriptionPlan === 'Premium' || userData.isAdmin === true) {
    return children;
  }

  // Block access for Free/Basic users
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md text-center bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
          <p className="text-gray-400 mb-4">
            This content is available only for premium subscribers.
          </p>
          <div className="bg-gray-700 p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">Premium Features Include:</h3>
            <ul className="text-sm text-left space-y-1">
              <li>• Ad-free music experience</li>
              <li>• Unlimited skips</li>
              <li>• High quality audio</li>
              <li>• Download songs for offline</li>
              <li>• Access to exclusive podcasts</li>
              <li>• Premium radio stations</li>
            </ul>
          </div>
        </div>
        <div className="space-y-3">
          <a
            href="/payment"
            className="block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Upgrade to Premium
          </a>
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumRoute;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB } from '../Backend/Firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContex';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active',
    expiryDate: null,
    features: ['basic_playback']
  });
  const [userData, setUserData] = useState({
    subscriptionPlan: 'Free',
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();

  // Load user data from Firestore on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(DB, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            subscriptionPlan: data.subscriptionPlan || 'Free',
            isAdmin: data.isAdmin || false
          });
          if (data.subscriptionPlan) {
            setSubscription(data.subscriptionPlan);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [authUser]);

  // Update subscription in Firestore
  const updateSubscription = async (newSubscription) => {
    if (!authUser?.uid) return;

    try {
      const userDocRef = doc(DB, 'users', authUser.uid);
      await setDoc(userDocRef, { subscriptionPlan: newSubscription }, { merge: true });
      setSubscription(newSubscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  // Create payment record
  const createPayment = async (paymentData) => {
    try {
      const paymentsRef = collection(DB, 'payments');
      const docRef = await addDoc(paymentsRef, {
        ...paymentData,
        userId: authUser?.uid,
        timestamp: new Date(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  };

  // Check if user has premium access
  const hasPremiumAccess = () => {
    return subscription.plan === 'premium' && subscription.status === 'active';
  };

  // Check if user can access specific feature
  const canAccessFeature = (feature) => {
    if (subscription.plan === 'premium' && subscription.status === 'active') {
      return true;
    }
    return subscription.features?.includes(feature) || false;
  };

  const value = {
    subscription,
    userData,
    updateSubscription,
    createPayment,
    hasPremiumAccess,
    canAccessFeature,
    loading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../Contex/AuthContex';
import { useSubscription } from '../Contex/SubscriptionContext';
import { DB } from '../Backend/Firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

const Payment = () => {
  const { authUser } = useAuth();
  const { subscription, upgradeSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');

  const plans = {
    premium: {
      name: 'Premium Individual',
      price: 199,
      duration: '1 month',
      features: ['Ad-free music', 'Unlimited skips', 'High quality audio', 'Download songs']
    },
    family: {
      name: 'Premium Family',
      price: 399,
      duration: '1 month',
      features: ['Ad-free music', 'Unlimited skips', 'High quality audio', 'Download songs', 'Up to 6 accounts']
    }
  };

  const handlePayment = async () => {
    if (!authUser?.uid || !upiId.trim()) {
      alert('Please enter a valid UPI ID');
      return;
    }

    setLoading(true);
    try {
      // Create payment record
      const paymentData = {
        userId: authUser.uid,
        userEmail: authUser.email,
        plan: selectedPlan,
        amount: plans[selectedPlan].price,
        upiId: upiId.trim(),
        status: 'pending',
        createdAt: new Date(),
        currency: 'INR'
      };

      // Save payment to Firestore
      const paymentRef = await addDoc(collection(DB, 'payments'), paymentData);

      // Simulate UPI payment process
      alert(`Payment initiated!\n\nPlan: ${plans[selectedPlan].name}\nAmount: ₹${plans[selectedPlan].price}\nUPI ID: ${upiId}\n\nPlease complete the payment in your UPI app.`);

      // In a real implementation, you would integrate with actual UPI payment gateway
      // For now, we'll simulate success after a delay
      setTimeout(async () => {
        try {
          // Update payment status
          await setDoc(doc(DB, 'payments', paymentRef.id), {
            ...paymentData,
            status: 'completed',
            completedAt: new Date()
          }, { merge: true });

          // Upgrade user subscription
          await upgradeSubscription(selectedPlan);

          alert('Payment successful! Your subscription has been upgraded.');
          setLoading(false);
        } catch (error) {
          console.error('Error completing payment:', error);
          alert('Payment failed. Please try again.');
          setLoading(false);
        }
      }, 3000);

    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>

        {/* Current Subscription Status */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Current Subscription</h2>
          <p className="text-gray-300">
            Plan: <span className="text-white capitalize">{subscription.plan}</span>
            {subscription.plan !== 'free' && (
              <span className="text-green-400 ml-2">
                (Expires: {subscription.endDate?.toLocaleDateString()})
              </span>
            )}
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`bg-gray-800 p-6 rounded-lg cursor-pointer transition-all ${
                selectedPlan === key ? 'ring-2 ring-green-500 bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  checked={selectedPlan === key}
                  onChange={() => setSelectedPlan(key)}
                  className="mr-3"
                />
                <h3 className="text-xl font-semibold">{plan.name}</h3>
              </div>
              <p className="text-2xl font-bold text-green-400 mb-2">₹{plan.price}<span className="text-sm text-gray-400">/{plan.duration}</span></p>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Form */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

          <div className="mb-4">
            <label className="block text-sm mb-2">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Enter your UPI ID (e.g., yourname@paytm)</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between mb-1">
                <span>{plans[selectedPlan].name}</span>
                <span>₹{plans[selectedPlan].price}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-400">
                <span>Total</span>
                <span>₹{plans[selectedPlan].price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !upiId.trim()}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Processing Payment...' : `Pay ₹${plans[selectedPlan].price} with UPI`}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Payment will be processed securely through UPI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

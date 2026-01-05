import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DB } from "../../Backend/Firebase";

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Optional: simple admin check (recommended)
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsub = onSnapshot(collection(DB, "payments"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ Approve payment
  const approvePayment = async (payment) => {
    try {
      // 1️⃣ Update payment status
      await updateDoc(doc(DB, "payments", payment.id), {
        status: "approved",
        verifiedAt: serverTimestamp(),
      });

      // 2️⃣ Update user subscription
      await updateDoc(doc(DB, "users", payment.userId), {
        subscriptionPlan: payment.plan,
        subscriptionStatus: "active",
      });

      alert("Payment approved successfully");
    } catch (error) {
      console.error("Approve failed:", error);
      alert("Failed to approve payment");
    }
  };

  // ❌ Reject payment
  const rejectPayment = async (payment) => {
    try {
      await updateDoc(doc(db, "payments", payment.id), {
        status: "rejected",
        verifiedAt: serverTimestamp(),
      });

      alert("Payment rejected");
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject payment");
    }
  };

  if (loading) {
    return <p className="text-gray-400 p-6">Loading payments...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Subscription Payments</h1>

      {payments.length === 0 ? (
        <p className="text-gray-400">No payment requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700 rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">User Email</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-700">
                  <td className="p-3">{p.userEmail}</td>
                  <td className="p-3">{p.plan}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">{p.transactionId}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : p.status === "approved"
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {p.status === "pending" ? (
                      <>
                        <button
                          onClick={() => approvePayment(p)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectPayment(p)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;

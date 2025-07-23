import React, { useState, useEffect } from "react";
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);

    if (!user) {
      setMessage("User not authenticated");
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      setIsSuccess(false);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await sendEmailVerification(user);
      
      // **Show success message and clear fields**
      setMessage("Password changed successfully. A confirmation email has been sent.");
      setIsSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Error: " + error.message);
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scroll
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scroll when unmounted
    };
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg w-[600px] relative">
      {message && (
        <div
          className={`absolute top-0 left-0 right-0 p-2 text-center rounded-t-lg ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">Change Password</h1>
      <form
        onSubmit={(e) => {
          handleChangePassword(e);
          setTimeout(() => {
            setMessage("");
          }, 8000); 
        }}
        className="space-y-4"
      >
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";

const ResetPass = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Reset link sent to your ${email} email!`, {
        position: "top-center",  
        autoClose: 3000,      
        hideProgressBar: true,  
        closeOnClick: true,    
        pauseOnHover: false,
        draggable: false
      });
    } catch (error) {
      toast.error("Error: " + error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false
      });
    }
  };

  return (
    <section className="w-full h-[calc(100vh-70px)] flex justify-center flex-col items-center bg-slate-600">
      <header>
        <h1 className="mt-4 text-3xl text-purple-100 font-extrabold tracking-widest">
          Reset Password
        </h1>
      </header>

      <main>
        <form
          className="w-[450px] h-[250px] rounded-xl bg-slate-800 mt-4 p-5 border-b-2"
          onSubmit={handleResetPassword}
        >
          <div className="py-2">
            <label htmlFor="email" className="text-white font-mono font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded"
            />
          </div>

          <div className="py-6">
            <button
              type="submit"
              className="flex justify-center items-center px-6 h-[40px] py-[8px] bg-purple-600 text-white w-full font-extrabold tracking-wider"
            >
              Reset Password
            </button>
          </div>
          <div className="text-white flex gap-2">
            <h1>Back to login?</h1>
            <NavLink to="/login" className="hover:text-blue-400">Click here</NavLink>
          </div>
        </form>
      </main>

     
      <ToastContainer />
    </section>
  );
};
 
export default ResetPass;

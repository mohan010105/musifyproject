import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [eye, setEye] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", {
        position: "top-center",  
        autoClose: 3000,        
        hideProgressBar: true,  
        closeOnClick: true,     
        pauseOnHover: false,
        draggable: false
      });
      window.location.assign("/home");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      toast.error("Invalid email or password! " + err.code, {
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
          Login
        </h1>
      </header>

      <main>
        <form
          className="w-[450px] h-[360px] rounded-xl bg-slate-800 mt-4 p-5 border-b-2"
          onSubmit={handleLogin}
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
          <div className="py-2 relative">
            <label htmlFor="password" className="text-white font-mono font-bold">
              Password
            </label>
            <span
              onClick={() => setEye(!eye)}
              className="absolute right-3 top-10 cursor-pointer"
            >
              {eye ? <FaEye /> : <FaEyeSlash />}
            </span>
            <input
              type={eye ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded"
            />
          </div>

          <div>
            <NavLink to="/resetpass" className="text-white hover:underline hover:text-blue-400">
              Forget password?
            </NavLink>
          </div>
          <div className="py-6">
            <button
              type="submit"
              className="flex justify-center items-center px-6 h-[40px] py-[8px] bg-purple-600 text-white w-full font-extrabold tracking-wider"
            >
              Login
            </button>
          </div>
          <div className="text-white flex gap-2 justify-center">
            <h1 className="text-bold">New to Musify?</h1>
            <NavLink to="/register" className="text-blue-400 hover:underline">
              Register
            </NavLink>
          </div>
        </form>
      </main>

      
      <ToastContainer />
    </section>
  );
};

export default Login;

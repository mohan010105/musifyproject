import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { _Auth } from '../Backend/Firebase';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);

  let navigate=useNavigate()
  
  const [data, setData] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    userconfirmpassword: "",
  });

  const { username, useremail, userpassword, userconfirmpassword } = data;

  
  function handlechange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }


  // Password validation function
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpperCase) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    if (!hasLowerCase) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }
    if (!hasNumbers) {
      toast.error("Password must contain at least one number");
      return false;
    }
    if (!hasSpecialChar) {
      toast.error("Password must contain at least one special character");
      return false;
    }
    return true;
  };

  async function handlesubmit(e) {
    e.preventDefault();

    if (!username || !useremail || !userpassword || !userconfirmpassword) {
      toast.error("All fields are required");
      return;
    }

    // Validate password requirements
    if (!validatePassword(userpassword)) {
      return;
    }

    try {
      if (userpassword === userconfirmpassword) {
        let userData = await createUserWithEmailAndPassword(_Auth, useremail, userpassword);

     
        await sendEmailVerification(userData.user);
        toast.success("Verification email sent to " + useremail);
        console.log(userData.user);


        setData({
          username: "",
          useremail: "",
          userpassword: "",
          userconfirmpassword: "",
        });

        updateProfile(userData.user,{
          displayName:username,
          photoURL:"https://cdn-icons-png.flaticon.com/512/9187/9187604.png"  
        });

        navigate("/login")

      } else {
        toast.error("Passwords do not match");
      }
    } catch (err) {
      toast.error("Error: " + err.code);
    }
  }


  return (
    <section className='w-full h-[calc(100vh-70px)] flex justify-center flex-col items-center bg-slate-600'>
      <header>
        <h1 className='mt-4 text-3xl text-purple-100 font-extrabold tracking-widest'>Register</h1>
      </header>

      <main>
        <form className='w-[400px] h-[450px] rounded-xl bg-slate-800 mt-4 p-5 border-b-2' onSubmit={handlesubmit}>
  
          <div className='py-2'>
            <label htmlFor="name" className='text-white font-mono font-bold'>Username</label>
            <input type="text" id='name' placeholder='Enter your Name'
              className='text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded'
              onChange={handlechange} value={username} name='username' />
          </div>

      
          <div className='py-2'>
            <label htmlFor="email" className='text-white font-mono font-bold'>Email</label>
            <input type="email" id='email' placeholder='Enter your email'
              className='text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded'
              onChange={handlechange} value={useremail} name='useremail' />
          </div>

    
          <div className='py-2 relative'>
            <label htmlFor="password" className='text-white font-mono font-bold'>Password</label>
            <span onClick={() => setEye(!eye)} className="absolute right-3 top-10 cursor-pointer">
              {eye ? <FaEye /> : <FaEyeSlash />}
            </span>
            <input type={eye ? "text" : "password"} id='password' placeholder='Enter your password'
              className='text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded'
              onChange={handlechange} value={userpassword} name='userpassword' />
          </div>


          <div className='py-2 relative'>
            <label htmlFor="password1" className='text-white font-mono font-bold'>Confirm password</label>
            <span onClick={() => setEye2(!eye2)} className="absolute right-3 top-10 cursor-pointer">
              {eye2 ? <FaEye /> : <FaEyeSlash />}
            </span>
            <input type={eye2 ? "text" : "password"} id='password1' placeholder='Confirm password'
              className='text-amber-100 placeholder:text-white font-serif w-full border border-slate-300 focus:outline-0 px-3 py-2 rounded'
              onChange={handlechange} value={userconfirmpassword} name='userconfirmpassword' />
          </div>
          <div className="text-white flex gap-2">
            <h1>Already have a account?</h1>

           <NavLink to= "/login" className="hover:text-blue-400">Click here</NavLink>

          </div>

          
          <div className='py-6'>
            <button type="submit"
              className='flex px-[145px] h-[40px] py-[8px] bg-purple-600 text-white w-full font-extrabold tracking-wider'>
              Register
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}

export default Register;

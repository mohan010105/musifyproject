import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useContext } from "react";
import { createContext } from "react";
import { _Auth } from "../Backend/Firebase";
import { toast } from "react-toastify";

export const MyGarage = createContext();

export const useAuth = () => {
  const context = useContext(MyGarage);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContex provider');
  }
  return context;
};

const AuthContex = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const handleLogout = async () => {
    await signOut(_Auth);
    setAuthUser(null);
    toast.success("Logout Successful");
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(_Auth, (userInfo) => {
      if (userInfo.emailVerified === true) {
        setAuthUser(userInfo);
      } else {
        setAuthUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <MyGarage.Provider value={{ authUser, handleLogout }}>
      {children}
    </MyGarage.Provider>
  );
};

export default AuthContex;

import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState } from "react";
import { createContext } from "react";
import { _Auth } from "../Backend/Firebase";
import { toast } from "react-toastify";

 export let MyGarage = createContext();
const AuthContex= ({children}) => {
  const [authUser, setAuthUser] = useState(null);

  const handleLogout = async () => {
    await signOut(_Auth);
    setAuthUser(null);
    toast.success("Logout Successful");
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(_Auth, (userInfo) => {
      if (userInfo.emailVerified===true) {
        setAuthUser(userInfo);
      } else {
        setAuthUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <MyGarage.Provider value={{ authUser, handleLogout }}>
        {children}
        
      </MyGarage.Provider>
    </div>
  );
};



export default AuthContex;

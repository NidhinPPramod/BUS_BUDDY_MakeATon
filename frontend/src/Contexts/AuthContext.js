import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

const AuthContext = createContext({
  currentUser: null,
  register: () => Promise,
  login: () => Promise,
  logout: () => Promise,
  signInWithGoogle: () => Promise,
  forgotPassword:()=>Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  
  function signInWithGoogle() {
    const provider=new GoogleAuthProvider()
    return signInWithPopup(auth,provider)
  }
  
  function forgotPassword(email) {
    return sendPasswordResetEmail(auth,email,{
      url:`https://cusat-busbuddy.web.app/login`,
    })
  }

  
  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    register,
    login,
    logout,
    signInWithGoogle,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

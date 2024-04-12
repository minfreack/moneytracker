'use client'

import { createContext, useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/services/firebase'
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userAuth, setUserAuth] = useState({
        auth: [],
        user: []
    })

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUserAuth({
            ...auth,
            auth: user,
          });
        });
    
        return () => unsubscribe();
      }, []);

    return (
        <AuthContext.Provider value={{userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
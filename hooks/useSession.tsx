'use client'
import {useContext} from "react";
import {AuthContext} from "@/context/auth";
import signOut from "@/services/firebase/auth/sign-out";

export const useSession = () => {
    const { setUserAuth} = useContext(AuthContext);

    const onSignOut = async() => {
        setUserAuth(null);
        await signOut();
    }

    return {
        onSignOut
    }
}
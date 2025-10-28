import {  createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [authenticated, setAuthenticated]  = useState(false);
    const [user, setUser] = useState(null);
    const [dark, setDark]  = useState(false)

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const mode = localStorage.getItem("mode")

        if(token){setAuthenticated(true)};
        if(userStr){setUser(JSON.parse(userStr))}
        if( mode){ setDark(JSON.parse(mode))}
    }, [])
       
    const login = (credentials)=>{
        setAuthenticated(true);
        setUser(credentials)
    }

    const  logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setAuthenticated(true);
        setUser(null)
    }

    const modeChange = ()=>{
        localStorage.setItem("mode", `${!dark}`)
        setDark(!dark)
    }

      return(
        <AuthContext.Provider value={{authenticated, user , dark, modeChange  , login, logout}}>
            {children}
        </AuthContext.Provider>
      )
}
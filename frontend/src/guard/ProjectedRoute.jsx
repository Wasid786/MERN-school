import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({children , allowedRoles =[]}){
       const {user, authenticated} = useContext(AuthContext);
       const [checked, setChecked] = useState(false);

       useEffect(()=>{
        setChecked(true)
       }, [])



    if(checked && !authenticated) return <Navigate to={'/login'}></Navigate>

    if(checked && allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={'/login'}></Navigate>
    if( checked) {
        return children;
    }

   

 
}
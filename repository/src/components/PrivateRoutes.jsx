/*import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoutes() {
  const notToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJjb3NtYXJjZWxsb0B1Y2EuZWR1LmFyIiwiaWF0IjoxNzI2NTg2MDg0LCJleHAiOjE3MjY1ODk2ODR9.lbLkXhovxs7wqTnmTXtykXdRl0xFOJsVt4ctIlBsrzU";
  const token = localStorage.getItem("token");
    if (token == null || token == notToken){
      return(<Navigate to="/"/>);
    }else{
      return(
        <Outlet/>
      );
    }
}

export default PrivateRoutes;*/

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
    const authToken = localStorage.getItem('authToken'); // Verifica si el token existe

    // Si no hay token, redirige al login
    if (!authToken) {
        return <Navigate to="/login" />;
    }

    // Si hay token, renderiza el componente hijo (la página protegida)
    return children;
};

export default PrivateRoutes;

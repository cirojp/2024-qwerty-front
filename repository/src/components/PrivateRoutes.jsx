import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const checkIfValidToken = async (token) => {
    try {
        const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/transacciones/userTest", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            return token;
        }else{
            localStorage.removeItem("token");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener las categorías personalizadas:", error);
        localStorage.removeItem("token");
        return null;
    }
};

const PrivateRoutes = async() => {
    
    const actualToken = localStorage.getItem("token");
    const token = checkIfValidToken(actualToken);

    if (!token) {
        return <Navigate to="/" />;
    }
    
    return <Outlet />;
    

    // Si hay token, renderiza el componente hijo (la página protegida)
};

export default PrivateRoutes;

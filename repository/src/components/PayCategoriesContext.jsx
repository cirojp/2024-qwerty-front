// PayCategoriesContext.js
import React, { createContext, useContext, useState } from 'react';

// Crea el contexto
const PayCategoriesContext = createContext();

// Proveedor de contexto
export const PayCategoriesProvider = ({ children }) => {
    const [payCategories, setPayCategories] = useState([]);

    return (
        <PayCategoriesContext.Provider value={{ payCategories, setPayCategories }}>
            {children}
        </PayCategoriesContext.Provider>
    );
};

// Hook para usar el contexto
export const usePayCategories = () => {
    return useContext(PayCategoriesContext);
};

import React, { useEffect, useState } from 'react'
import ActionButtons from './ActionButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlender, faCandyCane, faFileInvoiceDollar, faHouse, faTicket } from '@fortawesome/free-solid-svg-icons';
import icono from "../assets/edit-icon.png";
//import icono2 from '../assets/iconosCategorias/icono2.png';


function ProfilePage() {
    const defaultCategories = [
        { value: "Impuestos y Servicios", label: "Impuestos y Servicios", iconPath: "edit-icon.png" },
        { value: "Entretenimiento y Ocio", label: "Entretenimiento y Ocio", iconPath: "edit-icon.png" },
        { value: "Hogar y Mercado", label: "Hogar y Mercado", iconPath: "edit-icon.png" },
        { value: "Antojos", label: "Antojos", iconPath: "edit-icon.png" },
        { value: "Electro", label: "Electrodomesticos", iconPath: "edit-icon.png" }
    ];
    const iconMap = {
        'edit-icon.png': icon1,
    };
    const [payCategories, setPayCategories] = useState(defaultCategories); 

    const fetchPersonalCategorias = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/personal-categoria", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                const customOptions = data.map(cat => ({ label: cat.nombre, value: cat.nombre, iconPath: cat.iconPath }));
                setPayCategories(prevCategories => [...prevCategories, ...customOptions]);
            }
        } catch (error) {
            console.error("Error al obtener las categorías personalizadas:", error);
        }
    };
    useEffect(() => {
        fetchPersonalCategorias();
    }, []);
  return (
        <div className="container min-h-screen min-w-full max-w-full bg-black">
            <div className='text-white font-bold'>Mi Cuenta</div>
            <ActionButtons />
            <div className='text-white'>
                <div className='text-bold text-yellow-500 text-xl mb-3 underline'>Mis Categorias</div>
                <ul>
                    {payCategories.map((category) => (
                        <li key={category.value} className="flex items-center mb-2">
                            <img src={icono} alt={category.label} className="w-6 h-6 mr-2" />

                            {category.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
  )
}

export default ProfilePage;
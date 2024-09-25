import React, { useEffect, useState } from 'react'
import ActionButtons from './ActionButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlender, faCandyCane, faFileInvoiceDollar, faHouse, faTicket } from '@fortawesome/free-solid-svg-icons';
import { faBook, faCameraAlt, faCameraRetro, faCar, faHeart, faImage, faMugHot, faMusic, faStar, faUser } from '@fortawesome/free-solid-svg-icons';


function ProfilePage() {
    const iconMap = {
        faBlender: faBlender,
        faCandyCane: faCandyCane,
        faFileInvoiceDollar: faFileInvoiceDollar,
        faHouse: faHouse,
        faTicket: faTicket,
        faBook: faBook,
        faCameraAlt: faCameraAlt,
        faCameraRetro: faCameraRetro,
        faCar: faCar,
        faHeart: faHeart,
        faImage: faImage,
        faMugHot: faMugHot,
        faMusic: faMusic,
        faStar: faStar,
        faUser: faUser,
    };
    const defaultCategories = [
        { value: "Impuestos y Servicios", label: "Impuestos y Servicios", iconPath: "faFileInvoiceDollar" },
        { value: "Entretenimiento y Ocio", label: "Entretenimiento y Ocio", iconPath: "faTicket" },
        { value: "Hogar y Mercado", label: "Hogar y Mercado", iconPath: "faHouse" },
        { value: "Antojos", label: "Antojos", iconPath: "faCandyCane" },
        { value: "Electrodomesticos", label: "Electrodomesticos", iconPath: "faBlender" }
    ];
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
                            <FontAwesomeIcon icon={iconMap[category.iconPath]} className='mr-2' />
                            {category.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
  )
}

export default ProfilePage;
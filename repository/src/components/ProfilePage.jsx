import React, { useEffect } from 'react'
import ActionButtons from './ActionButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlender, faCandyCane, faFileInvoiceDollar, faHouse, faTicket } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {
    const presetCats = [
        {value: "Impuestos y Servicios", icon:faFileInvoiceDollar},
        {value: "Entretenimiento y Ocio", icon:faTicket},
        {value: "Hogar y Mercado", icon: faHouse},
        {value: "Antojos", icon:faCandyCane},
        {value: "Electrodomesticos", icon:faBlender},
        
    ]
    const getCategorias = () => {
        console.log("GET CAT");
    }
    useEffect(() => {
        getCategorias();
    }, []);
  return (
    <div className="container min-h-screen min-w-full max-w-full bg-black">
        <div className='text-white font-bold'>Mi Cuenta</div>
        <ActionButtons/>
        <div className='text-white'>
            <div className='text-bold text-yellow-500 text-xl mb-3 underline'>Mis Categorias</div>
            <ul>
                {presetCats.map((category) => (
                    <li key={category.value}>
                        <FontAwesomeIcon icon={category.icon} className='mr-2'/>
                        {category.value}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default ProfilePage
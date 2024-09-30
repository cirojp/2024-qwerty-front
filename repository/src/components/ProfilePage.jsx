import React, { useEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ModalCategoria from './ModalCategoria';
import './styles/ProfilePage.css';
import logo from "../assets/logo-removebg-preview.png";

function ProfilePage() {
    library.add(fas);
    const defaultCategories = [
        { value: "Impuestos y Servicios", label: "Impuestos y Servicios", iconPath: "fa-solid fa-file-invoice-dollar", textColor: 'mr-2 text-yellow-500'},
        { value: "Entretenimiento y Ocio", label: "Entretenimiento y Ocio", iconPath: "fa-solid fa-ticket", textColor: 'mr-2 text-yellow-500'},
        { value: "Hogar y Mercado", label: "Hogar y Mercado", iconPath: "fa-solid fa-house", textColor: 'mr-2 text-yellow-500'},
        { value: "Antojos", label: "Antojos", iconPath: "fa-solid fa-candy-cane", textColor: 'mr-2 text-yellow-500'},
        { value: "Electrodomesticos", label: "Electrodomesticos", iconPath: "fa-solid fa-blender", textColor: 'mr-2 text-yellow-500'},
        {value: "Clase", label: "Clase", iconPath: "fa-solid fa-chalkboard-user", textColor: 'mr-2 text-yellow-500'},
    ];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payCategories, setPayCategories] = useState([]);
    const [editCategory, setEditCategory] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);  // Nuevo estado para controlar el modo (editar/agregar)

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
                const customOptions = data.map(cat => ({ label: cat.nombre, value: cat.nombre, iconPath: cat.iconPath, textColor: 'mr-2 text-white' }));
                setPayCategories(customOptions);
            }
        } catch (error) {
            console.error("Error al obtener las categorías personalizadas:", error);
        }
    };

    useEffect(() => {
        fetchPersonalCategorias();
    }, []);

    const handleEdit = async(categoryValue, newName, newIcon) => {
        console.log(categoryValue);
        const filteredCategories = payCategories.filter(category => category.value === categoryValue.value);
        const token = localStorage.getItem("token");
        const inputValue = {
            nombre: filteredCategories[0].label,
            iconPath: filteredCategories[0].iconPath
        };
        const newValue = {
            nombre: newName,
            iconPath: newIcon
        };
        try {
            const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/personal-categoria/" + inputValue.nombre, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newValue)
            });
            if(response.ok){
                console.log(`Categoría editada: ${categoryValue}`);
                setPayCategories([]);
                await fetchPersonalCategorias();
            }
        }catch(err){
            console.log(err);
        }
    };

    const handleDelete = async(categoryValue) => {
        const filteredCategories = payCategories.filter(category => category.value === categoryValue);
        const token = localStorage.getItem("token");
        const inputValue = {
            nombre: filteredCategories[0].label,
            iconPath: filteredCategories[0].iconPath
        };
        try {
            const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/personal-categoria", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(inputValue)
            });
            if(response.ok){
                console.log(`Categoría eliminada: ${categoryValue}`);
                setPayCategories([]);
                await fetchPersonalCategorias();
            }
        }catch(err){
            console.log(err);
        }
    };

    const handleAddCategory = async(newName, newIcon) => {
        const token = localStorage.getItem("token");
        const newValue = {
            nombre: newName,
            iconPath: newIcon
        };
        try {
            const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/personal-categoria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newValue)
            });
            if(response.ok){
                console.log(`Categoría agregada: ${newName}`);
                setPayCategories([]);
                await fetchPersonalCategorias();
            }else{
                const errorMessage = await response.text();
                console.error("Error al agregar categoria:", errorMessage);
                console.log("la categoria existeeeeeeeeeee");
                return "La categoria ya existe";
            }
        }catch(err){
            console.log(err);
            return "";
        }
        return "";
    };

    return (
        <div className="min-h-screen flex bg-gray-900 py-10 relative">
            {/* Título "Mi Cuenta" arriba a la izquierda */}
            <div className="fixed top-10 left-16 text-2xl font-bold text-gray-100">
                Mi Cuenta
            </div>

            {/* Logo centrado verticalmente en el lado izquierdo */}
            <div className="fixed top-1/2 transform -translate-y-1/2 left-16">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-yellow-600">
                    <img 
                        src={logo} 
                        alt="logo" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className= "fixed top-1/2 transform -translate-y-1/2 right-16">
                <ActionButtons />
            </div>
            {/* Contenedor para categorías y tabla */}
            <div className="flex flex-col flex-grow px-8">
                <div className="flex justify-between w-full mt-16">
                    {/* Espacio vacío a la izquierda (primer cuarto) */}
                    <div className="w-1/4"></div>

                    {/* Tabla de categorías ocupando el espacio correcto (tercer al sexto octavo) */}
                    <div className="w-1/2 bg-gray-800 p-8 rounded-lg shadow-lg text-white">
                        <div className="mt-6">
                            <div className="font-bold text-yellow-500 text-xl text-center mb-4">
                                Mis Categorías
                            </div>

                            {/* Categorías por defecto */}
                            <ul>
                                {defaultCategories.map((category) => (
                                    <li key={category.value} className="flex items-center justify-between bg-gray-700 p-3 rounded-md shadow mb-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={category.iconPath} className={`${category.textColor} text-lg`} />
                                            <div className={category.textColor}>{category.label}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Categorías personalizadas */}
                            <ul>
                                {payCategories.map((category) => (
                                    <li key={category.value} className="flex items-center justify-between bg-gray-700 p-3 rounded-md shadow mb-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={category.iconPath} className={category.textColor} />
                                            <div className={category.textColor}>{category.label}</div>
                                        </div>
                                        <div>
                                            <button 
                                                className="ml-4 text-blue-500 hover:text-blue-700"
                                                onClick={() => {
                                                    setEditCategory(category);
                                                    setIsEditMode(true);  // Modo editar
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(category.value)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Botón para agregar categoría */}
                            <button 
                                className="mt-4 w-full px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-700"
                                onClick={() => {
                                    setEditCategory({});
                                    setIsEditMode(false);  // Modo agregar
                                    setIsModalOpen(true);
                                }}
                            >
                                Agregar Categoría
                            </button>
                        </div>

                        {/* Modal para agregar o editar categoría */}
                        <ModalCategoria 
                            isOpen={isModalOpen} 
                            edit={isEditMode} 
                            onRequestClose={() => setIsModalOpen(!isModalOpen)} 
                            handleEditCat={(nom, icon) => isEditMode ? handleEdit(editCategory, nom, icon) : handleAddCategory(nom, icon)} 
                            editCat={editCategory}
                            handleCreateCat={handleAddCategory}
                        />
                    </div>

                    {/* Espacio vacío a la derecha (último cuarto) */}
                    <div className="w-1/4"></div>
                </div>
            </div>
        </div>

    );
}

export default ProfilePage;

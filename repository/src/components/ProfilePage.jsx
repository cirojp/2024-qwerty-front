import React, { useEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ModalCategoria from './ModalCategoria';
import './styles/ProfilePage.css';

function ProfilePage() {
    library.add(fas);
    const defaultCategories = [
        { value: "Impuestos y Servicios", label: "Impuestos y Servicios", iconPath: "fa-solid fa-file-invoice-dollar", textColor: 'mr-2 text-yellow-500'},
        { value: "Entretenimiento y Ocio", label: "Entretenimiento y Ocio", iconPath: "fa-solid fa-ticket", textColor: 'mr-2 text-yellow-500'},
        { value: "Hogar y Mercado", label: "Hogar y Mercado", iconPath: "fa-solid fa-house", textColor: 'mr-2 text-yellow-500'},
        { value: "Antojos", label: "Antojos", iconPath: "fa-solid fa-candy-cane", textColor: 'mr-2 text-yellow-500'},
        { value: "Electrodomesticos", label: "Electrodomesticos", iconPath: "fa-solid fa-blender", textColor: 'mr-2 text-yellow-500'}
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
        <div className="container min-h-screen min-w-full max-w-full bg-black px-4 sm:px-8"> {/* Añadimos padding lateral */}
    <div className='text-white font-bold text-lg sm:text-2xl'>Mi Cuenta</div> {/* Ajustamos tamaño de texto */}
    <ActionButtons />
    <div className='text-white mt-2'>
        <div className='font-bold text-yellow-500 text-lg sm:text-xl mb-3 underline'>Mis Categorías</div>
        <ul>
            {defaultCategories.map((category) => (
                <li key={category.value} className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={category.iconPath} className={`${category.textColor} text-sm sm:text-lg`} />
                        <div className={category.textColor}>{category.label}</div>
                    </div>
                </li>
            ))}
        </ul>
        <ul>
            {payCategories.map((category) => (
                <li key={category.value} className="flex flex-wrap items-center justify-between mb-2"> {/* Añadimos flex-wrap */}
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={category.iconPath} className={category.textColor} />
                        <div className={category.textColor}>{category.label}</div>
                    </div>
                    <div className="mt-2 sm:mt-0"> {/* Ajustamos margin-top en móviles */}
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
        <button 
            className="mt-4 w-full sm:w-auto px-3 py-3 bg-yellow-500 text-black hover:bg-yellow-700"
            onClick={() => {
                setEditCategory({});
                setIsEditMode(false);  // Modo agregar
                setIsModalOpen(true);
            }}
        >
            Agregar Categoría
        </button>
    </div>
    <ModalCategoria 
        isOpen={isModalOpen} 
        edit={isEditMode} 
        onRequestClose={() => setIsModalOpen(!isModalOpen)} 
        handleEditCat={(nom, icon) => isEditMode ? handleEdit(editCategory, nom, icon) : handleAddCategory(nom, icon)} 
        editCat={editCategory}
        handleCreateCat={handleAddCategory}
    />
</div>

    );
}

export default ProfilePage;

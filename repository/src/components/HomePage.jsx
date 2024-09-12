import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TransaccionesTable from './TransaccionesTable';
import ModalForm from './ModalForm';
import ActionButtons from './ActionButtons';
import './styles/HomePage.css';


function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
    const [motivo, setMotivo] = useState("");  
    const [valor, setValor] = useState("");    
    const [fecha, setFecha] = useState("");    
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [tipoGasto, setTipoGasto] = useState("");
    const [payOptions, setPayOptions] = useState([
        { value: "credito", label: "Tarjeta de credito" },
        { value: "debito", label: "Tarjeta de debito" },
        { value: "efectivo", label: "Efectivo" }
    ]);
    const [selectedPayMethod, setSelectedPayMethod] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transaccionId, setTransaccionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getTransacciones();
        fetchPersonalTipoGastos();
    }, []);

    const getTransacciones = () => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8080/api/transacciones/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setTransacciones(data))
        .catch(err => console.log(err));
    };

    const fetchPersonalTipoGastos = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/personal-tipo-gasto", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const customOptions = data.map(tipo => ({ label: tipo.nombre, value: tipo.nombre }));
                setPayOptions([...payOptions, ...customOptions]);
            }
        } catch (error) {
            console.error("Error al obtener los tipos de gasto personalizados:", error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        clearForm();
    };

    const clearForm = () => {
        setMotivo("");
        setDescripcion("");
        setValor("");
        setSelectedPayMethod(null);
        setFecha("");
    };

    const editRow = (row) => {
        setEdit(true);
        setMotivo(row.motivo);
        setDescripcion(row.descripcion);
        setValor(row.valor);
        const selectedOption = payOptions.find(option => option.value === row.tipoGasto);
        setSelectedPayMethod(selectedOption || null);
        setFecha(row.fecha);
        setTransaccionId(row.id);
        openModal();
    };

    const agregarTransaccion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const url = edit 
            ? `http://localhost:8080/api/transacciones/${transaccionId}` 
            : "http://localhost:8080/api/transacciones";
        
        const method = edit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ motivo, descripcion, valor, tipoGasto, fecha })
            });

            if (response.ok) {
                const data = await response.json();
                if (edit) {
                    const updatedTransacciones = transacciones.map(t =>
                        t.id === data.id ? data : t
                    );
                    setTransacciones(updatedTransacciones);
                } else {
                    const updatedTransacciones = [...transacciones, data];
                    updatedTransacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    setTransacciones(updatedTransacciones);
                }
                closeModal();
            } else {
                setError("Error al agregar o actualizar la transacción");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    const deleteRow = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/transacciones/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                setTransacciones(transacciones.filter(t => t.id !== id));
            } else {
                setError("Error al eliminar la transacción");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    const handlePayChange = (value) => {
        setTipoGasto(value ? value.value : "");
        setSelectedPayMethod(value);
    };

    const handleMotivoChange = (e) => {
        setMotivo(e.target.value);
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleCreate = async (inputValue) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/personal-tipo-gasto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(inputValue)
            });

            if (response.ok) {
                const newTipoGasto = await response.json();
                const newOption = { label: newTipoGasto.nombre, value: newTipoGasto.nombre };
                setPayOptions(prevOptions => [...prevOptions, newOption]);
                setSelectedPayMethod(newOption);
                setTipoGasto(newTipoGasto.nombre);
            }
        } catch (error) {
            console.error("Error al agregar el tipo de gasto personalizado:", error);
        }
    };

    const signOff = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const deleteAccount = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/auth`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                localStorage.removeItem("token");
                navigate("/");
            } else {
                setError("Error al eliminar la cuenta");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    return (
        //<div className="container mx-auto p-6"}>
        <div className="container min-h-screen min-w-full max-w-full bg-indigo-950">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Transacciones</h1>
            <div className="tabla shadow-md rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-0">
                    <h2 className="text-2xl py-2 px-4 font-bold text-center mb-4 text-gray-100">Historial de Transacciones</h2>
                    <button 
                        className="bg-red-500 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                        onClick={openModal}
                    >
                        Agregar Transacción
                    </button>
                </div>
                <TransaccionesTable
                    transacciones={transacciones}
                    editRow={editRow}
                    deleteRow={deleteRow}
                />
            </div>

            
            <ModalForm
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                agregarTransaccion={agregarTransaccion}
                edit={edit}
                motivo={motivo}
                descripcion={descripcion}
                valor={valor}
                fecha={fecha}
                handleMotivoChange={handleMotivoChange}
                handleDescripcionChange={handleDescripcionChange}
                setValor={setValor}
                handlePayChange={handlePayChange}
                selectedPayMethod={selectedPayMethod}
                payOptions={payOptions}
                handleCreate={handleCreate}
                setFecha={setFecha}
            />

            <ActionButtons
                navigate={navigate}
                signOff={signOff}
                deleteAccount={deleteAccount}
            />
        </div>
    );
}

export default HomePage;

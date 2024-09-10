import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom'; 
import ExpandedRow from './ExpandedRow';
import CreatableSelect from 'react-select/creatable';
import Modal from 'react-modal';

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
        {value: "credito", label: "Tarjeta de credito"},
        {value: "debito", label: "Tarjeta de debito"},
        {value: "efectivo", label: "Efectivo"}
    ]);
    const [selectedPayMethod, setSelectedPayMethod] = useState(null); // Inicialmente nulo
    const navigate = useNavigate(); // Inicializa useNavigate para navegar entre rutas
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transaccionId, setTransaccionId] = useState(null);

    // Estilos para el modal
    const modalStyles = {
        content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        maxWidth: '90%',
        zIndex: 1001,
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Superposición oscura para cubrir el fondo
            zIndex: 1000, // Asegura que la superposición esté por debajo del modal
        },
    };    

    // Validaciones
    const validateMotivo = (value) => {
        const regex = /^[a-zA-Z0-9\s]{0,30}$/;
        return regex.test(value);
    };

    const validateDescripcion = (value) => {
        const regex = /^[a-zA-Z0-9\s,.]{0,70}$/;
        return regex.test(value);
    };

    const handleMotivoChange = (e) => {
        const value = e.target.value;
        if (validateMotivo(value)) {
            setMotivo(value);
            setError(null);
        } else {
            setError("El motivo debe tener un máximo de 30 caracteres y solo puede contener letras y números.");
        }
    };

    const handleDescripcionChange = (e) => {
        const value = e.target.value;
        if (validateDescripcion(value)) {
            setDescripcion(value);
            setError(null);
        } else {
            setError("La descripción debe tener un máximo de 70 caracteres y solo puede contener letras, números, comas y puntos.");
        }
    };


    const columns = [
        {
            name: "Motivo",
            selector: row => row.motivo,
        },
        {
            name: "Valor",
            selector: row => row.valor,
            sortable: true
        },
        {
            name: "Fecha",
            selector: row => row.fecha,
            format: row => new Date(row.fecha).toLocaleString(),
            sortable: true
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="flex space-x-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => editRow(row)}
                    >
                        Editar
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => deleteRow(row.id)}
                    >
                        Eliminar
                    </button>
                </div>
            )
        }
    ];

    const getTransacciones = () =>{
        const token = localStorage.getItem("token");
        console.log(token);

        fetch("http://localhost:8080/api/transacciones/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setTransacciones(data))
        .catch(err => console.log(err));
    }
    
    useEffect(() => {
        getTransacciones();
        fetchPersonalTipoGastos();
    }, []);

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
        setSelectedPayMethod(selectedOption || null); // Selecciona el tipo de gasto correcto
        setFecha(row.fecha);
        setTransaccionId(row.id);
        openModal();
    };

    const agregarTransaccion = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;  // Detener la ejecución si la validación falla
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
                body: JSON.stringify({ motivo, descripcion, valor,tipoGasto, fecha})
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
                    updatedTransacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Orden descendente por fecha
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
        setTipoGasto(value ? value.value : ""); // Usa el valor del objeto seleccionado
        setSelectedPayMethod(value);
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
                body: JSON.stringify(inputValue) // Enviar solo el texto
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
    }

    const deleteAccount = async() => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/auth`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                console.log("Eliminado");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                setError("Error al eliminar la transacción");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    }

    const validateForm = () => {
        if (!selectedPayMethod || !selectedPayMethod.value) {
            setError("Por favor, selecciona un tipo de gasto.");
            return false;
        }
        return true;
    };
    

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Transacciones</h1>
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <DataTable 
                    title="Historial de Transacciones"
                    columns={columns}
                    data={transacciones}
                    pagination
                    className="mb-4"
                    expandableRows={true}
                    expandableRowsComponent={({data}) => <ExpandedRow data={data}/>}
                />
            </div>
            <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={openModal}
            >
                Agregar Transacción
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Agregar Transacción"
                className="modal"
                overlayClassName="modal-overlay"
                style={{
                    content: modalStyles.content,
                    overlay: modalStyles.overlay,
                }}
            >
                <h2 className="text-2xl font-semibold mb-4">{edit ? "Editar Transacción" : "Agregar Nueva Transacción"}</h2>
                <form onSubmit={agregarTransaccion} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Motivo:</label>
                        <input 
                            type="text" 
                            value={motivo}
                            onChange={handleMotivoChange}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Descripcion:</label>
                        <input 
                            type="text" 
                            value={descripcion}
                            onChange={handleDescripcionChange}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Valor:</label>
                        <input 
                            type="number" 
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Tipo de Gasto:</label>
                        <CreatableSelect 
                            options={payOptions} 
                            onChange={handlePayChange}
                            onCreateOption={handleCreate}
                            value={selectedPayMethod}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Fecha:</label>
                        <input 
                            type="datetime-local" 
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        {edit ? "Guardar Cambios" : "Agregar Transacción"}
                    </button>
                </form>
                <button 
                    onClick={closeModal}
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Cerrar
                </button>
            </Modal>
            <div className="mt-6">
                <button 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => navigate('/change-password')}
                >
                    Cambiar Contraseña
                </button>
                <button 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg ml-5"
                    onClick={() => signOff()}
                >
                    Cerrar Sesion
                </button>
                <button 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg ml-5"
                    onClick={() => deleteAccount()}
                >
                    Eliminar Cuenta
                </button>
            </div>
        </div>
    );
}

export default HomePage;
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import ExpandedRow from './ExpandedRow';
import Select from 'react-select';

function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
    const [motivo, setMotivo] = useState("");  
    const [valor, setValor] = useState("");    
    const [fecha, setFecha] = useState("");    
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [tipoGasto, setTipoGasto] = useState("");
    const navigate = useNavigate(); // Inicializa useNavigate para navegar entre rutas

    const payOptions = [
        {value: "credito", label: "Tarjeta de credito"},
        {value: "debito", label: "Tarjeta de debito"},
        {value: "efectivo", label: "Efectivo"}
    ]


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
    
    useEffect(() => {
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
    }, []);

    const [transaccionId, setTransaccionId] = useState(null);

    const editRow = (row) => {
        setEdit(true);
        setMotivo(row.motivo);
        setDescripcion(row.descripcion);
        setValor(row.valor);
        setTipoGasto(row.tipoGasto);
        setFecha(row.fecha);
        setTransaccionId(row.id);
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
                    setTransacciones([...transacciones, data]);
                }
                setMotivo("");
                setDescripcion("");
                setValor("");
                setTipoGasto("");
                setFecha("");
                setEdit(false);
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
            <h2 className="text-2xl font-semibold mb-4">{edit ? "Editar Transacción" : "Agregar Nueva Transacción"}</h2>
            <form onSubmit={agregarTransaccion} className="space-y-4">
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Motivo:</label>
                    <input 
                        type="text" 
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Descripcion:</label>
                    <input 
                        type="text" 
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
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
                    {/*<input 
                        type="text" 
                        value={tipoGasto}
                        onChange={(e) => setTipoGasto(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />*/}
                    <Select options={payOptions} onChange={(value) => {setTipoGasto(value.label)}}/>
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
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-6">
                <button 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => navigate('/change-password')}
                >
                    Cambiar Contraseña
                </button>
            </div>
        </div>
    );
}

export default HomePage;

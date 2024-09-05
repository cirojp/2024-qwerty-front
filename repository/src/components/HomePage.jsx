import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
    const [motivo, setMotivo] = useState("");  
    const [valor, setValor] = useState("");    
    const [fecha, setFecha] = useState("");    
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);  // Para guardar el ID de la transacción en edición

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
                <>
                    <button onClick={() => editRow(row)}>Editar</button>
                    <button onClick={() => deleteRow(row.id)}>Eliminar</button>
                </>
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
        setValor(row.valor);
        setFecha(row.fecha);
        setTransaccionId(row.id); // Captura el ID de la transacción
    };


    const agregarTransaccion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!edit) {
            try {
                const response = await fetch("http://localhost:8080/api/transacciones", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        motivo: motivo,
                        valor: valor,
                        fecha: fecha
                    }),
                });
    
                if (response.ok) {
                    const nuevaTransaccion = await response.json();
                    setTransacciones([...transacciones, nuevaTransaccion]); 
                    setMotivo("");
                    setValor("");
                    setFecha("");
                } else {
                    setError("Error al agregar la transacción");
                }
            } catch (err) {
                console.error("Error al agregar la transacción:", err);
                setError("Ocurrió un error. Intenta nuevamente.");
            }
        } else {
            try {
                const response = await fetch(`http://localhost:8080/api/transacciones/${transaccionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        motivo: motivo,
                        valor: valor,
                        fecha: fecha
                    }),
                });
    
                if (response.ok) {
                    const transaccionActualizada = await response.json();
                    const transaccionesActualizadas = transacciones.map(t =>
                        t.id === transaccionActualizada.id ? transaccionActualizada : t
                    );
                    setTransacciones(transaccionesActualizadas);
                    setMotivo("");
                    setValor("");
                    setFecha("");
                    setEdit(false);
                } else {
                    setError("Error al actualizar la transacción");
                }
            } catch (err) {
                console.error("Error al actualizar la transacción:", err);
                setError("Ocurrió un error. Intenta nuevamente.");
            }
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
            console.error("Error al eliminar la transacción:", err);
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };
    

    return (
        <div>
            <h1>Transacciones</h1>
            <div>
                <DataTable 
                    title="Historial de Transacciones"
                    columns={columns}
                    data={transacciones}
                    pagination
                    onRowClicked={(row, event) => {
                        editRow(row);
                    }}
                />
            </div>
            <h2>{edit ? "Editar Transacción" : "Agregar Nueva Transacción"}</h2>
            <form onSubmit={agregarTransaccion}>
                <div>
                    <label>Motivo:</label>
                    <input
                        type="text"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Valor:</label>
                    <input
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fecha y Hora:</label>
                    <input
                        type="datetime-local"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{edit ? "Guardar Cambios" : "Agregar Transacción"}</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default HomePage;

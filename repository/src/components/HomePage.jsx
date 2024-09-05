import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
    const [motivo, setMotivo] = useState("");  
    const [valor, setValor] = useState("");    
    const [fecha, setFecha] = useState("");    // Campo para la fecha y hora
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);

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
            format: row => new Date(row.fecha).toLocaleString(), // Formatea la fecha
            sortable: true
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

    const editRow = (row) =>{
        console.log(row)
        setEdit(true);
        setMotivo(row.motivo);
        setValor(row.valor);
        setFecha(row.fecha);

    }

    const agregarTransaccion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!edit){
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
                        fecha: fecha // Envía la fecha seleccionada
                    }),
                });
    
                if (response.ok) {
                    const nuevaTransaccion = await response.json();
                    setTransacciones([...transacciones, nuevaTransaccion]); 
                    setMotivo("");
                    setValor("");
                    setFecha(""); // Limpia el campo de fecha después de guardar
                } else {
                    setError("Error al agregar la transacción");
                }
            } catch (err) {
                console.error("Error al agregar la transacción:", err);
                setError("Ocurrió un error. Intenta nuevamente.");
            }
        }else{
            console.log("Editar celda");
            setMotivo("");
            setValor("");
            setFecha("");
            setEdit(0);
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
                        editRow(row)
                    }}
                />
            </div>
            <h2>Agregar Nueva Transacción</h2>
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
                        type="datetime-local"  // Usamos un campo de fecha y hora
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Agregar Transacción</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default HomePage;

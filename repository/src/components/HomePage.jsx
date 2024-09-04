import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
    const [motivo, setMotivo] = useState("");  // Campo para el motivo
    const [valor, setValor] = useState("");    // Campo para el valor
    const [error, setError] = useState(null);

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
        .then(data => {
            setTransacciones(data);
        })
        .catch(err => console.log(err));
    }, []);

    const agregarTransaccion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

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
                }),
            });

            if (response.ok) {
                const nuevaTransaccion = await response.json();
                setTransacciones([...transacciones, nuevaTransaccion]); // Agregar nueva transacción a la lista
                setMotivo("");
                setValor("");
            } else {
                setError("Error al agregar la transacción");
            }
        } catch (err) {
            console.error("Error al agregar la transacción:", err);
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
                <button type="submit">Agregar</button>
            </form>
            {error && <div style={{color: "red"}}>{error}</div>}
        </div>
    );
}

export default HomePage;

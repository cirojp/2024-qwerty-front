import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'

function HomePage() {
    const [transacciones, setTransacciones] = useState([]);
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
    ]

    useEffect(() => {
        const token = localStorage.getItem("token");  // Obtener el token del localStorage

        fetch("http://localhost:8080/api/transacciones", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`  // Incluir el token en el encabezado
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setTransacciones(data);
            
        })
        .catch(err => console.log(err));
    }, []);

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
            {/*<ul>
                {transacciones.map(transaccion => (
                    <li key={transaccion.id}>
                        Motivo: {transaccion.motivo}, Valor: {transaccion.valor}
                    </li>
                ))}
            </ul>*/}
        </div>
    );
}

export default HomePage;
import React, { useEffect, useState } from 'react'
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
        {
            name: "Fecha",
            selector: row => row.fecha,
            sortable: true
        }
    ]

    const data = [
        {
            motivo: "Compras",
            valor: 150,
            fecha: "Ayer"
        },
        {
            motivo: "Comida",
            valor: 1500,
            fecha: "Hoy"
        }
    ]

    /*useEffect(() => {
        fetch("http://localhost:8080/api/transacciones", { method: "GET" })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTransacciones(data);
            })
            .catch(err => console.log(err));
    }, []);*/

    return (
        <div>
            <h1>Transacciones</h1>
            <div>
                <DataTable 
                    title="Historial de Transacciones"
                    columns={columns}
                    data={data}
                    pagination
                />
            </div>
            {/*<div>
            <h1>Transacciones</h1>
            <ul>
                {/*transacciones.map(transaccion => (
                    <li key={transaccion.id}>
                        Motivo: {transaccion.motivo}, Valor: {transaccion.valor}
                    </li>
                ))}
                <li></li>
            </ul>
        </div>*/}
        </div>
    );
}

export default HomePage;

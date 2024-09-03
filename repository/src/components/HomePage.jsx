import React, { useEffect, useState } from 'react'


function HomePage() {
    const [transacciones, setTransacciones] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/transacciones", { method: "GET" })
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
            <ul>
                {transacciones.map(transaccion => (
                    <li key={transaccion.id}>
                        Motivo: {transaccion.motivo}, Valor: {transaccion.valor}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;

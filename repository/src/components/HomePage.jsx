import React, { useEffect, useState } from 'react'

function HomePage() {
    const [transacciones, setTransacciones] = useState([])
    useEffect(()=>{
        fetch("http://localhost:8080/api/transacciones", {method: "GET", mode: 'no-cors'})
        .then((data) => {
            console.log(data);
            setTransacciones(data)
        })
        .catch(err => console.log(err))
    },[])
    return (
        <div>HomePage</div>
    )
}

export default HomePage
import React from 'react';
import DataTable from 'react-data-table-component';
import ExpandedRow from './ExpandedRow';

function TransaccionesTable({ transacciones, editRow, deleteRow }) {
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

    return (
        <DataTable 
            title="Historial de Transacciones"
            columns={columns}
            data={transacciones}
            pagination
            expandableRows={true}
            expandableRowsComponent={({data}) => <ExpandedRow data={data}/>}
        />
    );
}

export default TransaccionesTable;

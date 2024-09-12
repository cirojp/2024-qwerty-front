import React from 'react';
import DataTable from 'react-data-table-component';
import ExpandedRow from './ExpandedRow';
import './TransaccionesTable.css';

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
                        className="btn-action"
                        onClick={() => editRow(row)}
                    >
                        Editar
                    </button>
                    <button 
                        className="btn-delete"
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
            className="data-table"
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

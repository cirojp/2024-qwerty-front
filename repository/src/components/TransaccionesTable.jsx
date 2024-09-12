import React from 'react';
import DataTable, {createTheme} from 'react-data-table-component';
import ExpandedRow from './ExpandedRow';
import './styles/TransaccionesTable.css';

function TransaccionesTable({ transacciones, editRow, deleteRow }) {
    createTheme("dark", {
        background: {
			default: '#1b1c31',
		},
    })
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
                        &#x270F;
                    </button>
                    <button 
                        className="btn-delete"
                        onClick={() => deleteRow(row.id)}
                    >
                        &#x274E;
                    </button>
                </div>
            )
        }
    ];

    return (
        <DataTable 
            className="data-table"
            columns={columns}
            data={transacciones}
            pagination
            expandableRows={true}
            expandableRowsComponent={({data}) => <ExpandedRow data={data}/>}
            theme='dark'
        />
    );
}

export default TransaccionesTable;

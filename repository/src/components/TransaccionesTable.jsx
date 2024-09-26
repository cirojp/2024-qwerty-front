import React from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import ExpandedRow from './ExpandedRow';
import deleteIcon from "../assets/delete-icon.png";
import editIcon from "../assets/edit-icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';



function TransaccionesTable({ transacciones, editRow, deleteRow, onTableEmpty = () =>{}, onTransactions = () => {}}) {
    createTheme("dark", {
        background: {
            default: '#1E2126',
        },
        
    });
    library.add(fas);

    const columns = [
        {
            name: <span className="text-l text-center font-bold">Motivo</span>,
            selector: row => row.motivo,
            cell: row => <div className="text-center">{row.motivo}</div>
        },
        {
            name: <span className="text-l text-center font-bold">Valor ($)</span>, 
            selector: row => row.valor,
            sortable: true,
            cell: row => <div className="text-center">{row.valor}</div>
        },
        {
            name:<span className='text-l text-center font-bold'>Categoria</span>,
            selector: row => row.categoria,
            sortable: true,
            cell: row => (<div className="text-center items-center">{row.categoria}</div>)
        },
        {
            name: <span className="text-l text-center font-bold">Fecha</span>,
            selector: row => row.fecha,
            format: row => new Date(row.fecha).toJSON().slice(0,10),
            sortable: true,
            cell: row => <div className="text-center">{new Date(row.fecha).toJSON().slice(0,10)}</div>
        },
        {
            name: <span className="text-l text-center font-bold">Acciones</span>, 
            cell: (row) => (
                <div className="flex justify-center space-x-4">
                    <button 
                        className="bg-yellow-500 text-white font-bold py-1 px-1 rounded hover:bg-yellow-600 transition-colors duration-300"
                        onClick={() => editRow(row)}
                    >
                        <img 
                            src={editIcon} 
                            alt="Edit" 
                            className="w-5 h-5 justify-center" 
                        />
                    </button>
                    <button 
                        className="bg-red-600 text-white font-bold py-1 px-1 rounded hover:bg-red-700 transition-colors duration-300"
                        onClick={() => deleteRow(row.id)}
                    >
                        <img 
                                src={deleteIcon} 
                                alt="Delete" 
                                className="w-5 h-5 justify-center" 
                            />
                    </button>
                </div>
            )
        }
    ];
    if(transacciones[0] == null){
        onTableEmpty();
    }else{
        onTransactions();
        return (
            <DataTable 
                className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg mb-0"
                columns={columns}
                data={transacciones}
                pagination
                expandableRows={true}
                expandableRowsComponent={({data}) => <ExpandedRow data={data} />}
                theme='dark'
                responsive
            />
        );
    }
}

export default TransaccionesTable;

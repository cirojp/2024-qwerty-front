import React, { useState, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import ExpandedRow from './ExpandedRow';
import deleteIcon from "../assets/delete-icon.png";
import editIcon from "../assets/edit-icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

function TransaccionesTable({ transacciones, editRow, deleteRow, onTableEmpty = () => {}, onTransactions = () => {}, payCategories = [] }) {
    // Crear un tema oscuro para la tabla
    createTheme("dark", {
        background: {
            default: '#1E2126',
        },
    });
    
    library.add(fas);

    // Configurar las columnas
    const columns = [
        // Columna de Motivo
        {
            name: <span className="text-sm sm:text-lg font-bold text-center">Motivo</span>,
            selector: row => row.motivo,
            cell: row => <div className="text-sm text-center">{row.motivo}</div>,
            wrap: true,  // Envolver texto si es largo
            minWidth: "150px",  // Establecer un ancho mínimo para que no sea muy pequeño
        },
        // Columna de Valor
        {
            name: <span className="text-sm sm:text-lg font-bold text-center">Valor ($)</span>,
            selector: row => row.valor,
            sortable: true,
            cell: row => <div className="text-sm text-center">{row.valor}</div>,
            minWidth: "100px",  // Limitar el tamaño de la columna
            wrap: true,
        },
        // Columna de Categoría
        {
            name: <span className="text-sm sm:text-lg font-bold text-center">Categoría</span>,
            selector: row => row.categoria,
            sortable: true,
            cell: row => {
                const category = payCategories.find(cat => cat.value === row.categoria);
                const icon = row.categoria === "Otros"
                    ? <FontAwesomeIcon icon="fa-solid fa-circle-dot" className="mr-2" />
                    : <FontAwesomeIcon icon={category?.iconPath} className="mr-2 text-yellow-400" />;
    
                return (
                    <div className="text-sm sm:text-base text-center flex items-center justify-center space-x-2">
                        {icon}
                        <span className="truncate" title={row.categoria}>
                            {row.categoria}
                        </span>
                    </div>
                );
            },
            wrap: true,  // Asegurarse de que el texto se ajuste
            minWidth: "180px",  // Asegurar que la columna tenga suficiente espacio para el texto y el icono
        },
        // Columna de Fecha
        {
            name: <span className="text-sm sm:text-lg font-bold text-center">Fecha</span>,
            selector: row => row.fecha,
            format: row => new Date(row.fecha).toJSON().slice(0, 10),
            sortable: true,
            cell: row => <div className="text-sm text-center">{new Date(row.fecha).toJSON().slice(0, 10)}</div>,
            minWidth: "120px",  // Tamaño mínimo de la columna
            wrap: true,
        },
        // Columna de Acciones
        {
            name: <span className="text-sm sm:text-lg font-bold text-center">Acciones</span>,
            cell: (row) => (
                <div className="flex justify-center space-x-2 sm:space-x-4">
                    <button
                        className="bg-yellow-500 text-white font-bold py-1 px-2 sm:px-3 rounded hover:bg-yellow-600 transition-colors duration-300"
                        onClick={() => editRow(row)}
                    >
                        <img
                            src={editIcon}
                            alt="Edit"
                            className="w-4 h-4 sm:w-5 sm:h-5 justify-center"
                        />
                    </button>
                    <button
                        className="bg-red-600 text-white font-bold py-1 px-2 sm:px-3 rounded hover:bg-red-700 transition-colors duration-300"
                        onClick={() => deleteRow(row.id)}
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            className="w-4 h-4 sm:w-5 sm:h-5 justify-center"
                        />
                    </button>
                </div>
            ),
            button: true,
            minWidth: "120px",  // Asegurar un ancho mínimo para que los botones se vean bien
            wrap: true,
        },
    ];
    

    // Verificar si hay transacciones
    if (transacciones[0] == null) {
        onTableEmpty();
    } else {
        onTransactions();

        return (
            <DataTable
                className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg mb-0"
                columns={columns}
                data={transacciones}
                pagination
                expandableRows={true}
                expandableRowsComponent={({ data }) => <ExpandedRow data={data} />}
                theme="dark"
                responsive
                noHeader
            />
        );
    }
}

export default TransaccionesTable;

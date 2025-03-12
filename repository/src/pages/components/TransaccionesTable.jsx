import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import ExpandedRow from "./ExpandedRow";
import deleteIcon from "../../assets/delete-icon.png";
import editIcon from "../../assets/edit-icon.png";

function TransaccionesTable({
  transacciones,
  editRow,
  deleteRow,
  onTableEmpty = () => {},
  onTransactions = () => {},
  payCategories = [],
  grupoAbierto = true,
}) {
  createTheme("dark", {
    background: {
      default: "#1E2126",
    },
  });

  const userEmail = localStorage.getItem("mail");

  const columns = [
    // Columna de Motivo
    {
      name: (
        <span className="text-sm sm:text-lg font-bold text-center">Motivo</span>
      ),
      selector: (row) => row.motivo,
      cell: (row) => <div className="text-sm text-center">{row.motivo}</div>,
      wrap: true, // Envolver texto si es largo
      minWidth: "150px", // Establecer un ancho mínimo para que no sea muy pequeño
    },
    // Columna de Valor
    {
      name: (
        <span className="text-sm sm:text-lg font-bold text-center">
          Valor ($)
        </span>
      ),
      selector: (row) => row.valor,
      sortable: true,
      cell: (row) => <div className="text-sm text-center">{row.valor}</div>,
      minWidth: "100px", // Limitar el tamaño de la columna
      wrap: true,
    },
    {
      name: (
        <span className="text-sm sm:text-lg font-bold text-center">
          Acciones
        </span>
      ),
      cell: (row) =>
        grupoAbierto ? ( // Mostrar los botones solo si grupoAbierto es true
          row.users === undefined || row.users === userEmail ? (
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
          ) : (
            <div className="text-sm text-center">Sin permiso</div>
          )
        ) : (
          <div className="text-sm text-center">Sin acciones</div> // Mostrar "Sin acciones" si grupoAbierto es false
        ),
      button: true,
      minWidth: "120px",
      wrap: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.categoria == "Ingreso de Dinero",
      style: {
        backgroundColor: "rgba(44, 148, 30, 1)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
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
        expandableRowsComponent={({ data }) => (
          <ExpandedRow data={data} payCategories={payCategories} />
        )}
        theme="dark"
        conditionalRowStyles={conditionalRowStyles}
        responsive
        noHeader
      />
    );
  }
}

export default TransaccionesTable;

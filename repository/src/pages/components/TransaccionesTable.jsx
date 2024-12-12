import React from "react";

const TransaccionesTable = ({ transactions = [] }) => {
  const statusStyles = {
    Rejected: "bg-red-500 text-white",
    "On Progress": "bg-yellow-500 text-white",
    Completed: "bg-green-500 text-white",
    "On Hold": "bg-orange-500 text-white",
  };

  return (
    <div className="w-full p-4 bg-gray-900 text-white rounded-md">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      {/* Contenedor de la tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse hidden md:table">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2">Fecha</th>
              <th className="py-2">Motivo</th>
              <th className="py-2">Valor</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="py-2">{transaction.fecha}</td>
                <td className="py-2">{transaction.motivo}</td>
                <td className="py-2">{transaction.valor}</td>
                <td className="py-2">
                  <span>{transaction.categoria}</span>
                </td>
                <td className="py-2 flex space-x-2">
                  <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                    🔍
                  </button>
                  <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista responsiva: tarjetas */}
      <div className="space-y-4 md:hidden">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-md shadow-md border border-gray-700"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm">Date:</span>
              <span>{transaction.fecha}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm mr-2">Description:</span>
              <span className="truncate">{transaction.motivo}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm">Amount:</span>
              <span>{transaction.valor}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Status:</span>
              <span className={`px-2 py-1 rounded-md text-s`}>
                {transaction.categoria}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                🔍
              </button>
              <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransaccionesTable;

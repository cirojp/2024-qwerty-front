import React from "react";

const ExpandedRow = ({data = {
    motivo: "",
    valor: "",
    categoria: "",
    fecha: "",
}}) => {
  return (
    <div className="bg-gray-950 shadow-md rounded-lg p-4 sm:p-6 min-w-full sm:min-w-max">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <div className="font-bold text-gray-300">Motivo:</div>
        <div className="text-gray-200">{data.motivo}</div>

        <div className="font-bold text-gray-300">Valor:</div>
        <div className="text-gray-200">{data.valor}</div>

        <div className="font-bold text-gray-300">Categoría:</div>
        <div className="text-gray-200">{data.categoria}</div>

        <div className="font-bold text-gray-300">Fecha:</div>
        <div className="text-gray-200">{data.fecha}</div>
      </div>
    </div>
  );
};

export default ExpandedRow;

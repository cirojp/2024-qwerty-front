import React from "react";


const ExpandedRow = ({data = {
    motivo: "",
    valor: "",
    fecha: "",
    descripcion: "",
    tipoGasto: "",
}}) => {
  return (
    <div className="bg-blue-950 shadow-md rounded-lg p-8 w-full">
    <div className="grid grid-cols-2 gap-3">
      <div className="font-bold px-20">Motivo:</div>
      <div>{data.motivo}</div>

      <div className="font-bold px-20">Descripción:</div>
      <div>{data.descripcion}</div>

      <div className="font-bold px-20">Valor:</div>
      <div>{data.valor}</div>

      <div className="font-bold px-20">Tipo de Gasto:</div>
      <div>{data.tipoGasto}</div>

      <div className="font-bold px-20">Fecha:</div>
      <div>{data.fecha}</div>
    </div>
  </div>
  );
};

export default ExpandedRow;

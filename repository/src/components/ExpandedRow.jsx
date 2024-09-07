import React from "react";

const ExpandedRow = ({data = {
    motivo: "",
    valor: "",
    fecha: ""
}}) => {
  return (
    <div>
      <div>Motivo: {data.motivo}</div>
      <div>Descripcion: {data.descripcion}</div>
      <div>Valor: {data.valor}</div>
      <div>Tipo de Gasto: {data.tipoGasto}</div>
      <div>Fecha: {data.fecha}</div>
    </div>
  );
};

export default ExpandedRow;

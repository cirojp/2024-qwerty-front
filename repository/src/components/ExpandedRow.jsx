import React from "react";
import "./styles/ExpandedRow.css";

const ExpandedRow = ({data = {
    motivo: "",
    valor: "",
    fecha: "",
    descripcion: "",
    tipoGasto: "",
}}) => {
  return (
    <div className="expandable-row">
      <div>Motivo: {data.motivo}</div>
      <div>Descripcion: {data.descripcion}</div>
      <div>Valor: {data.valor}</div>
      <div>Tipo de Gasto: {data.tipoGasto}</div>
      <div>Fecha: {data.fecha}</div>
    </div>
  );
};

export default ExpandedRow;

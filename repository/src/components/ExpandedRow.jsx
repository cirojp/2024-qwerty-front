import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const ExpandedRow = ({data = {
    motivo: "",
    valor: "",
    categoria: "",
    fecha: "",
    tipoGasto: "",
  },
  payCategories = [],
}) => {
  library.add(fas);
  const category = payCategories.find((cat) => cat.value === data.categoria);
  return (
    <div className="bg-gray-950 shadow-md rounded-lg p-4 sm:p-6 min-w-full sm:min-w-max">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <div className="font-bold text-gray-300">Motivo:</div>
        <div className="text-gray-200">{data.motivo}</div>

        <div className="font-bold text-gray-300">Valor:</div>
        <div className="text-gray-200">{data.valor}</div>

        <div className="font-bold text-gray-300">Categoría:</div> 
        
        <div>
        <>
              <FontAwesomeIcon icon={category.iconPath} className="mr-2" />
              {category.label}
            </>
        </div>
        <div className="font-bold text-gray-300">Tipo de Gasto:</div>
        <div className="text-gray-200">{data.tipoGasto}</div>
        <div className="font-bold text-gray-300">Fecha:</div>
        <div className="text-gray-200">{data.fecha}</div>
      </div>
    </div>
  );
};

export default ExpandedRow;

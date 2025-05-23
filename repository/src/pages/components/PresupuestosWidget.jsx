import React, { useEffect, useState } from "react";
import BudgetCard from "./BudgetCard";
import { useNavigate } from "react-router-dom";

function PresupuestosWidget({ transacciones = [], filtroMes, filtroAno }) {
  const [presupuestos, setPresupuestos] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    getPersonalPresupuestos();
  }, []);

  const getPersonalPresupuestos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/presupuesto",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth() + 1;
        const añoActual = fechaActual.getFullYear();
        const formatoMesFiltro = `${filtroAno == "" ? añoActual : filtroAno}-${
          filtroMes === "" ? mesActual.toString().padStart(2, "0") : filtroMes
        }`;
        const dataActual = data.filter(
          (presupuesto) => presupuesto.budgetMonth === formatoMesFiltro
        );
        setPresupuestos(dataActual);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener las categorías personalizadas:", error);
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full"></div>
    </div>
   ) : (   
        <div className="m-4">
        {presupuestos[0] != null && (
          <button
            className="btn bg-black text-xl border-none md:text-2xl py-2 font-bold text-gray-100 hover:underline"
            onClick={() => navigate("/presupuestos")}
          >
            Presupuestos Actuales
          </button>
        )}
  
        {presupuestos.map((presupuesto, index) => (
          <BudgetCard
            key={presupuesto.id || index} // Se debe usar un identificador único (preferiblemente `presupuesto.id`)
            budget={presupuesto}
            transacciones={transacciones}
            widget={true}
          />
        ))}
      </div>
  );
}

export default PresupuestosWidget;

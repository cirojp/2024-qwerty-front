import React, { useEffect, useState } from "react";
import BudgetCard from "./BudgetCard";
import { useNavigate } from "react-router-dom";

function PresupuestosWidget({ transacciones = [] }) {
  const [presupuestos, setPresupuestos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getPersonalPresupuestos();
  }, []);
  const getPersonalPresupuestos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/presupuesto",
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
        const formatoMesActual = `${añoActual}-${mesActual
          .toString()
          .padStart(2, "0")}`;
        const dataActual = data.filter(
          (presupuesto) => presupuesto.budgetMonth === formatoMesActual
        );
        setPresupuestos(dataActual);
      }
    } catch (error) {
      console.error("Error al obtener las categorías personalizadas:", error);
    }
  };
  return (
    <div className="m-4">
      {presupuestos == [] && (
        <button
          className="btn bg-black text-xl md:text-2xl py-2 font-bold text-gray-100 hover:underline"
          onClick={() => navigate("/presupuestos")}
        >
          Presupuestos Actuales
        </button>
      )}

      {presupuestos.map((presupuesto) => (
        <BudgetCard
          budget={presupuesto}
          transacciones={transacciones}
          widget={true}
        />
      ))}
    </div>
  );
}

export default PresupuestosWidget;

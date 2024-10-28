import React, { useEffect, useState } from "react";
import BudgetCard from "./components/BudgetCard";
import ModalCreateBudget from "./components/ModalCreateBudget";

function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestos, setPresupuestos] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const defaultIcon = "https://cdn-icons-png.freepik.com/256/781/781760.png";
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
        setPresupuestos(data);
      }
    } catch (error) {
      console.error("Error al obtener las categorías personalizadas:", error);
    }
  };
  useEffect(() => {
    getPersonalPresupuestos();
  }, []);
  return (
    <div className="container h-full mx-auto p-4 bg-black">
      <div className="text-2xl font-semibold text-center mb-4 text-white">
        Presupuestos Mensuales
      </div>
      <div className="mb-6 mt-2 flex justify-left">
        <button className="btn bg-yellow-400 text-black" onClick={openModal}>
          Agregar Presupuesto
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {presupuestos.map((budget) => {
          const categoryNames = Object.keys(budget.categoryBudgets).join(", ");
          return (
            <BudgetCard
              title={categoryNames}
              icon={defaultIcon}
              dateFrom="01/10/2024"
              dateTo="31/10/2024"
              percentage={0}
              currentAmount="$0"
              maxAmount={"$" + budget.totalBudget}
              residualAmount={"$" + budget.totalBudget}
            />
          );
        })}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ModalCreateBudget closeModal={() => closeModal()} />
        </div>
      )}
    </div>
  );
}

export default BudgetPage;

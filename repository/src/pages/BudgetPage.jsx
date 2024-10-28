import React, { useState } from "react";
import BudgetCard from "./components/BudgetCard";
import ModalCreateBudget from "./components/ModalCreateBudget";

function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const defaultIcon = "https://cdn-icons-png.freepik.com/256/781/781760.png";
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
        <BudgetCard
          title="Restaurantes"
          icon={defaultIcon}
          dateFrom="01/10/2024"
          dateTo="31/10/2024"
          percentage={46}
          currentAmount="45,50 SAR"
          maxAmount="100,00 SAR"
          residualAmount="54,50 SAR"
        />
        <BudgetCard
          title="Combustible"
          icon={defaultIcon}
          dateFrom="01/10/2024"
          dateTo="31/10/2024"
          percentage={25}
          currentAmount="30,00 SAR"
          maxAmount="120,00 SAR"
          residualAmount="90,00 SAR"
        />
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

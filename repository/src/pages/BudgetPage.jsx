import React, { useState } from "react";
import BudgetCard from "./components/BudgetCard";

function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
          icon="/static/icons/ic_plate_fork_knife.svg"
          dateFrom="01/10/2024"
          dateTo="31/10/2024"
          percentage={46}
          currentAmount="45,50 SAR"
          maxAmount="100,00 SAR"
          residualAmount="54,50 SAR"
        />
        <BudgetCard
          title="Combustible"
          icon="/static/icons/ic_fuel.svg"
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
          <div className="modal-box w-full max-w-md p-6 bg-[#1E2126] rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">
              Agregar Nuevo Presupuesto
            </h3>

            <form>
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-1"
                  htmlFor="category"
                >
                  Categoría
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="Ej. Entretenimiento"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-1"
                  htmlFor="amount"
                >
                  Monto Máximo
                </label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Ej. 1000 SAR"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn bg-yellow-400 text-black">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetPage;

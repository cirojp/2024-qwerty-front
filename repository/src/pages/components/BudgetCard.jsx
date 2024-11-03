import React, { useEffect, useState } from "react";
import ModalCreateBudget from "./ModalCreateBudget"; // Importa tu modal

function BudgetCard({ budget, transacciones, onDelete, onEdit }) {
  const icon = "https://cdn-icons-png.freepik.com/256/781/781760.png";
  const [budgetTransactions, setBudgetTransactions] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const [remainingByCategory, setRemainingByCategory] = useState({});
  const [isFutureBudget, setIsFutureBudget] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const [budgetYear, budgetMonth] = budget.budgetMonth.split("-").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    setIsFutureBudget(
      budgetYear > currentYear ||
        (budgetYear === currentYear && budgetMonth > currentMonth)
    );

    const filteredTransactions = transacciones.filter((transaccion) => {
      const transactionDate = new Date(transaccion.fecha);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      const isSameMonth =
        transactionYear === budgetYear && transactionMonth === budgetMonth;
      const isCategoryValid = Object.keys(budget.categoryBudgets).includes(
        transaccion.categoria
      );

      return isSameMonth && isCategoryValid;
    });

    setBudgetTransactions(filteredTransactions);

    const total = filteredTransactions.reduce(
      (acc, transaccion) => acc + transaccion.valor,
      0
    );
    setTotalGastado(total);

    setPorcentaje((total / Number(budget.totalBudget)) * 100);

    const remaining = {};
    for (const [category, allocatedBudget] of Object.entries(
      budget.categoryBudgets
    )) {
      const spentInCategory = filteredTransactions
        .filter((transaccion) => transaccion.categoria === category)
        .reduce((acc, transaccion) => acc + transaccion.valor, 0);
      remaining[category] = allocatedBudget - spentInCategory;
    }
    setRemainingByCategory(remaining);
  }, [budget, transacciones]);

  function getFirstAndLastDayOfMonth(monthString) {
    const [year, month] = monthString.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return {
      dateFrom: firstDay.toISOString().split("T")[0],
      dateTo: lastDay.toISOString().split("T")[0],
    };
  }

  function handleEdit() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    onEdit();
  }

  const { dateFrom, dateTo } = getFirstAndLastDayOfMonth(budget.budgetMonth);
  const categoryNames = Object.keys(budget.categoryBudgets);
  const categoryString = categoryNames.join(", ");

  function handleDelete() {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este presupuesto?")
    ) {
      onDelete(budget);
    }
  }

  return (
    <div className="card shadow-lg rounded-lg bg-[#1E2126] p-4 text-white">
      <div className="flex items-center gap-4 mb-2">
        <img src={icon} alt={budget.nameBudget} className="w-10 h-10" />
        <div className="flex-1">
          <div className="text-xl font-semibold">{budget.nameBudget}</div>
          <div className="text-sm text-white">{categoryString}</div>
          <div className="text-sm text-white">{`${dateFrom} a ${dateTo}`}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div
            style={{ width: `${porcentaje > 100 ? 100 : porcentaje}%` }}
            className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all"
          />
        </div>
        <div className="text-sm font-semibold">{porcentaje}%</div>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span>$0</span>
        <span>Gastado: ${totalGastado}</span>
        <span>${budget.totalBudget}</span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm font-semibold text-white">{`Monto restante: $ ${
            budget.totalBudget - totalGastado
          }`}</span>
          {Object.entries(remainingByCategory).map(([category, remaining]) => (
            <div key={category}>
              <span className="text-sm font-semibold text-white">
                {category}: ${remaining < 0 ? 0 : remaining}{" "}
              </span>
            </div>
          ))}
        </div>
        {isFutureBudget && (
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline btn-info"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ModalCreateBudget
            closeModal={() => closeModal()}
            initialBudget={budget}
          />
        </div>
      )}
    </div>
  );
}

export default BudgetCard;

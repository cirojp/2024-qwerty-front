import React, { useEffect, useState } from "react";
import BudgetCard from "./components/BudgetCard";
import ModalCreateBudget from "./components/ModalCreateBudget";

function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestos, setPresupuestos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://two024-qwerty-back-2.onrender.com/api/transacciones/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTransacciones(data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (budget) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-2.onrender.com/api/presupuesto/${budget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTransacciones(presupuestos.filter((t) => t.id !== budget.id));
      } else {
        console.error("Error al eliminar el presupuesto");
      }
    } catch (err) {
      console.error("Ocurrió un error. Intenta nuevamente: ", err);
    } finally {
      getPersonalPresupuestos();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    getPersonalPresupuestos();
  };
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
          console.log(budget);
          return (
            <BudgetCard
              budget={budget}
              transacciones={transacciones}
              onDelete={handleDelete}
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

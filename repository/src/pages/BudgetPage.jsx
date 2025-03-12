import React, { useEffect, useState } from "react";
import BudgetCard from "./components/BudgetCard";
import ModalCreateBudget from "./components/ModalCreateBudget";
import { useNavigate } from "react-router-dom";

function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestos, setPresupuestos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("Todos");

  const onEdit = () => {
    setPresupuestos([]);
    getPersonalPresupuestos();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://two024-qwerty-back-1.onrender.com/api/transacciones/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTransacciones(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (budget) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-1.onrender.com/api/presupuesto/${budget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setPresupuestos(presupuestos.filter((t) => t.id !== budget.id));
      } else {
        console.error("Error al eliminar el presupuesto");
      }
    } catch (err) {
      console.error("Ocurrió un error. Intenta nuevamente: ", err);
    } finally {
      setPresupuestos([]);
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
        "https://two024-qwerty-back-1.onrender.com/api/presupuesto",
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

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarPresupuestos = () => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();
    const formatoMesActual = `${añoActual}-${mesActual
      .toString()
      .padStart(2, "0")}`;

    return presupuestos.filter((presupuesto) => {
      const budgetMonth = presupuesto.budgetMonth;

      if (filtro === "Todos") return true;
      if (filtro === "Pasados") return budgetMonth < formatoMesActual;
      if (filtro === "Actuales") return budgetMonth === formatoMesActual;
      if (filtro === "Futuros") return budgetMonth > formatoMesActual;

      return true;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <button
            className="btn bg-yellow-400 text-black mb-4 mr-2 sm:mb-0 sm:order-1"
            onClick={() => navigate("/")}
          >
            HomePage
          </button>
          <div className="text-2xl font-semibold text-center sm:flex-1">
            Presupuestos Mensuales
          </div>
          <div className="mt-4 sm:mt-0 sm:order-2">
            <select
              className="select select-bordered w-full max-w-xs bg-yellow-400 text-black"
              value={filtro}
              onChange={handleFilterChange}
            >
              <option value="Todos">Mostrar Todos</option>
              <option value="Pasados">Pasados</option>
              <option value="Actuales">Actuales</option>
              <option value="Futuros">Futuros</option>
            </select>
          </div>
        </div>

        {/* Mostrar un mensaje de carga o renderizar los BudgetCard */}
        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>{" "}
            Cargando presupuestos...
          </div>
        ) : presupuestos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <button
              className="btn bg-yellow-400 text-black text-xl w-64 h-10"
              onClick={openModal}
            >
              Agregar Presupuesto
            </button>
            <p className="text-lg mt-4">No tienes presupuestos aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtrarPresupuestos().map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                transacciones={transacciones}
                onDelete={handleDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}

        <div className="fixed bottom-6 right-6">
          <button className="btn bg-yellow-400 text-black" onClick={openModal}>
            Agregar Presupuesto
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ModalCreateBudget closeModal={closeModal} />
        </div>
      )}
    </div>
  );
}

export default BudgetPage;

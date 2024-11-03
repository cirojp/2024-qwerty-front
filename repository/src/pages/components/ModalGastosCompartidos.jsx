import Modal from "react-modal";
import "./styles/ModalForm.css";
import ModalCrearGrupo from "./ModalCrearGrupo";
import React, { useEffect, useState } from "react";
import ModalVerDetallesGrupo from "./ModalVerDetallesGrupo";

function ModalGastosCompartidos({ isModalGastosOpen, closeModalGastos }) {
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grupos, setGrupos] = useState([]); // Estado para grupos
  const [isModalDetallesGrupoOpen, setIsModalDetallesGrupoOpen] =
    useState(false);
  const closeModalDetallesGrupo = () => setIsModalDetallesGrupoOpen(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // Estado para el nombre del grupo seleccionado
  const fetchGrupos = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/grupos/mis-grupos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los grupos.");
      }

      const data = await response.json();
      setGrupos(data); // Guardar los grupos en el estado
    } catch (error) {
      setError("Ocurrió un error al obtener los grupos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalGastosOpen) {
      fetchGrupos(); // Fetch groups when modal opens
    }
  }, [isModalGastosOpen]);

  const closeWindow = () => {
    setModalError("");
    closeModalGastos();
  };
  const openModalDetallesGrupo = (grupo) => {
    const nombreGrupo = grupo.nombre;
    const idGrupo = grupo.id;
    const estado = grupo.estado;
    setGrupoSeleccionado({ nombre: nombreGrupo, id: idGrupo, estado: estado });
    setIsModalDetallesGrupoOpen(true);
  };

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: "2rem",
      borderRadius: "0.75rem",
      width: "90vw",
      maxWidth: "500px",
      maxHeight: "80vh",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      overflowY: "auto",
      zIndex: 1001,
    },
  };

  return (
    <Modal
      isOpen={isModalGastosOpen}
      onRequestClose={closeModalGastos}
      contentLabel="Mis Gastos Compartidos"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mis Gastos Compartidos
      </div>
      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          {/* Display user groups */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Grupos a los que perteneces:
            </h3>
            {isLoading ? (
              <p>Cargando grupos...</p>
            ) : (
              <ul>
                {grupos.length > 0 ? (
                  grupos.map((grupo) => (
                    <li
                      key={grupo.id}
                      className="py-1 cursor-pointer"
                      onClick={() => openModalDetallesGrupo(grupo)}
                    >
                      {grupo.nombre}
                    </li>
                  ))
                ) : (
                  <li>No perteneces a ningún grupo.</li>
                )}
              </ul>
            )}
          </div>

          <button
            className="mt-4 px-4 py-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-700 mr-2"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Crear Grupo
          </button>
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>

      <ModalCrearGrupo
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />

      {grupoSeleccionado && (
        <ModalVerDetallesGrupo
          isModalDetallesGrupoOpen={isModalDetallesGrupoOpen}
          closeModalDetallesGrupo={closeModalDetallesGrupo}
          grupo={grupoSeleccionado}
          setGrupoSeleccionado={setGrupoSeleccionado}
        />
      )}
    </Modal>
  );
}

export default ModalGastosCompartidos;

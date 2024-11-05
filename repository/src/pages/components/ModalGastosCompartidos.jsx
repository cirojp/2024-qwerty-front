import Modal from "react-modal";
import "./styles/ModalForm.css";
import ModalCrearGrupo from "./ModalCrearGrupo";
import React, { useEffect, useState } from "react";
import ModalVerDetallesGrupo from "./ModalVerDetallesGrupo";

function ModalGastosCompartidos({
  isModalGastosOpen,
  closeModalGastos,
  payCategories,
}) {
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grupos, setGrupos] = useState([]); // Estado para grupos
  const [isModalDetallesGrupoOpen, setIsModalDetallesGrupoOpen] = useState(false);
  const closeModalDetallesGrupo = () => setIsModalDetallesGrupoOpen(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // Estado para el nombre del grupo seleccionado
  const [grupoAEliminar, setGrupoAEliminar] = useState(null);
  const [grupoAAgregar, setGrupoAAgregar] = useState(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [isModalMiembrosOpen, setIsModalMiembrosOpen] = useState(false);
  const [miembros, setMiembros] = useState([]);
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
  const fetchMiembros = async (grupo) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-2.onrender.com/api/grupos/${grupo.id}/usuarios`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los miembros del grupo.");
      }

      const data = await response.json();
      setMiembros(data);
      setIsModalMiembrosOpen(true);
      setGrupoAAgregar(grupo);
    } catch (error) {
      setModalError("Ocurrió un error al obtener los miembros del grupo.");
    }
  };

  useEffect(() => {
    if (isModalGastosOpen && !isModalOpen) {
      fetchGrupos(); // Fetch groups when modal opens
    }
  }, [isModalGastosOpen, isModalOpen]);
  useEffect(() => {
    if (!isModalMiembrosOpen) {
      setGrupoAAgregar(null);
    }
  }, [isModalMiembrosOpen]);
  

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

  const openModalEliminar = (grupo) => {
    setGrupoAEliminar(grupo);
    setIsModalEliminarOpen(true);
  };

  const confirmDeleteGrupo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-2.onrender.com/api/grupos/${grupoAEliminar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setGrupos(grupos.filter((grupo) => grupo.id !== grupoAEliminar.id));
        setIsModalEliminarOpen(false);
      } else {
        setModalError("Error al eliminar el grupo.");
      }
    } catch (error) {
      setModalError("Ocurrió un error al intentar eliminar el grupo.");
    }
  };

  const closeModal = () => {
    setGrupoAAgregar(null);
    setIsModalOpen(false);
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
                      className="py-1 flex justify-between items-center"
                    >
                      <span
                        onClick={() => openModalDetallesGrupo(grupo)}
                        className="cursor-pointer"
                      >
                        {grupo.nombre}
                      </span>
                      <button
                        onClick={() => fetchMiembros(grupo)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Miembros
                      </button>
                      <button
                        onClick={() => openModalEliminar(grupo)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar grupo
                      </button>
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
        onRequestClose={() => closeModal()}
        grupoAAgregar={grupoAAgregar ? grupoAAgregar.id : null}
      />

      {grupoSeleccionado && (
        <ModalVerDetallesGrupo
          isModalDetallesGrupoOpen={isModalDetallesGrupoOpen}
          closeModalDetallesGrupo={closeModalDetallesGrupo}
          grupo={grupoSeleccionado}
          setGrupoSeleccionado={setGrupoSeleccionado}
          payCategories={payCategories}
          setGrupos={setGrupos}
          grupos={grupos}
        />
      )}

      <Modal
        isOpen={isModalEliminarOpen}
        onRequestClose={() => setIsModalEliminarOpen(false)}
        contentLabel="Confirmar eliminación de grupo"
        style={customStyles}
      >
        <h2 className="text-xl font-bold mb-4">
          ¿Está seguro que quiere eliminar el grupo?
        </h2>
        <p className="mb-6">
          Se eliminarán toda la información del grupo para todos los miembros.
        </p>
        <button
          onClick={confirmDeleteGrupo}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
        >
          Eliminar grupo
        </button>
        <button
          onClick={() => setIsModalEliminarOpen(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </Modal>

      {/* Modal para mostrar miembros */}
      <Modal
        isOpen={isModalMiembrosOpen}
        onRequestClose={() => {
          setIsModalMiembrosOpen(false);
          setGrupoAAgregar(null); 
        }}
        contentLabel="Lista de Miembros"
        style={customStyles}
      >
        <h2 className="text-xl font-bold mb-4">Miembros del grupo</h2>
        <ul>
          {miembros.length > 0 ? (
            miembros.map((miembro) => (
              <li key={miembro.id} className="py-1">
                {miembro.email}
              </li>
            ))
          ) : (
            <li>No hay miembros en este grupo.</li>
          )}
        </ul>
        {grupoAAgregar && grupoAAgregar.estado && (
          <button
            onClick={() => {
              setIsModalOpen(true); // Abre el modal de crear grupo
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Invitar Usuarios
          </button>
        )}

        <button
          onClick={() => setIsModalMiembrosOpen(false)}
          className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cerrar
        </button>
      </Modal>
</Modal>
  );
}

export default ModalGastosCompartidos;

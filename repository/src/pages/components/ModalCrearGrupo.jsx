import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const ModalCrearGrupo = ({
  isOpen = false,
  onRequestClose = () => {},
}) => {
  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      zIndex: 1002,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative",
      width: "90%",
      maxWidth: "500px",
      height: "auto",
      maxHeight: "90vh",
      padding: "20px",
      margin: "auto",
      borderRadius: "10px",
      backgroundColor: "#1a1a1a",
      overflowY: "auto",
    },
  };

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [grupoNombre, setGrupoNombre] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [usuarios, setUsuarios] = useState([]); // Lista de correos

  useEffect(() => {}, [isOpen]);

  const handleAddUsuario = () => {
    if (!correoUsuario) {
      setError("Por favor ingresa un correo.");
      return;
    }

    if (usuarios.includes(correoUsuario)) {
      setError("Este correo ya fue agregado.");
      return;
    }

    // Agregar el correo si no está duplicado
    setUsuarios([...usuarios, correoUsuario]);
    setCorreoUsuario("");
    setError(""); // Limpiar el mensaje de error si la adición fue exitosa
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!grupoNombre || usuarios.length === 0) {
      setError("Debes ingresar un nombre de grupo y al menos un usuario.");
      setIsLoading(false);
      return;
    }
    try {
      // Aquí iría la lógica para crear el grupo usando `grupoNombre` y `usuarios`
      const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/grupos", { // Ajusta la URL según tu endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: grupoNombre,
          usuarios: usuarios,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al crear el grupo.");
      }
  
      // Limpiar los campos y cerrar el modal si la solicitud fue exitosa
      setGrupoNombre("");
      setUsuarios([]);
      setError("");
      onRequestClose();
    } catch (error) {
      setError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleClose = () => {
    setError("");
    onRequestClose();
    setGrupoNombre("");
    setUsuarios([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={"Crear Grupo"}
      style={customStyles}
      className="bg-gray-900 text-white p-4 sm:p-2 rounded-lg shadow-lg"
    >
      <h2 className="text-xl sm:text-lg font-bold mb-4">{"Crear Nuevo Grupo"}</h2>
      <input
        type="text"
        placeholder="Nombre del Grupo"
        value={grupoNombre}
        onChange={(e) => setGrupoNombre(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
      />

      {/* Lista de correos agregados */}
      {usuarios.length > 0 && (
        <div className="mt-3 mb-3">
          <h3 className="text-lg font-semibold">Usuarios agregados:</h3>
          <ul className="list-disc pl-5">
            {usuarios.map((email, index) => (
              <li key={index} className="text-sm text-gray-300">
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}

      <input
        type="email"
        placeholder="Correo del Usuario"
        value={correoUsuario}
        onChange={(e) => setCorreoUsuario(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
      />
      <button
        onClick={handleAddUsuario}
        className="mt-2 w-full sm:w-auto bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Agregar Usuario
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 mr-2 w-full sm:w-auto bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
      >
        {isLoading ? (
          <div>
            <span className="loading loading-spinner loading-sm"></span>
            Cargando...
          </div>
        ) : (
          "Crear Grupo"
        )}
      </button>
      <button
        onClick={handleClose}
        className="mt-2 w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default ModalCrearGrupo;


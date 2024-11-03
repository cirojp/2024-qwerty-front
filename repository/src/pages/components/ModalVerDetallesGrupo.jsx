import Modal from "react-modal";
import Select from "react-select";
import "./styles/ModalForm.css";
import ModalCategoria from "./ModalCategoria";
import React, { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ConfirmDeleteCategory from "./ConfirmDeleteCategory";

function ModalVerDetallesGrupo({
  isModalDetallesGrupoOpen,
  closeModalDetallesGrupo,
  grupo,
  setGrupoSeleccionado
}) {
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deudas, setDeudas] = useState([]);
  const [total, setTotal] = useState(0);

  
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
      maxHeight: "80vh", // Limita la altura del modal
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      overflowY: "auto", // Habilita scroll si el contenido excede el tamaño
      zIndex: 1001,
    },
  };
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#111827",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#111827",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eab308" : "#111827",
      color: state.isSelected ? "black" : "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),
  };
  const fetchTransaccionesDelGrupo = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token"); 
    let url = `https://two024-qwerty-back-2.onrender.com/api/grupos/${grupo.id}/transacciones`;
    try {
    const response = await fetch(url, {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        setIsLoading(false);
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setTransacciones(data);
    setIsLoading(false);
    } catch (err) {
    setIsLoading(false);
    console.error("Error fetching transactions:", err);
    } 
    //fetchPersonalCategorias();
  };
  useEffect(() => {
    if (isModalDetallesGrupoOpen) {
      fetchTransaccionesDelGrupo();
    }
  }, [isModalDetallesGrupoOpen]);
  
  useEffect(() => {
    if (!grupo.estado && transacciones.length > 0) {
      calcularDeudas();
    }
  }, [transacciones, grupo.estado]);
  
  const closeWindow = () => {
    setDeudas([]);
    closeModalDetallesGrupo();
  };

  const calcularDeudas = () => {
    
    const usuariosGastos = {};
    // Agrupamos el gasto total por usuario
    transacciones.forEach(({ valor, users }) => {
      if (usuariosGastos[users]) {
        usuariosGastos[users] += valor;
      } else {
        usuariosGastos[users] = valor;
      }
    });
    const totalGastos = Object.values(usuariosGastos).reduce((a, b) => a + b, 0);
    const gastoPorPersona = totalGastos / Object.keys(usuariosGastos).length;
    const deudasCalculadas = [];
    // Dividir usuarios en deudores y acreedores
    const deudores = [];
    const acreedores = [];
    Object.entries(usuariosGastos).forEach(([usuario, gasto]) => {
        const diferencia = gastoPorPersona - gasto;
        if (diferencia > 0) {
        // Usuario debe dinero
        deudores.push({ usuario, cantidad: diferencia });
        } else if (diferencia < 0) {
        // Usuario tiene exceso de gasto (acreedor)
        acreedores.push({ usuario, cantidad: -diferencia });
        }
    });
    // Distribuir deudas entre deudores y acreedores
    deudores.forEach((deudor) => {
        let cantidadDeuda = deudor.cantidad;
        acreedores.forEach((acreedor) => {
        if (cantidadDeuda <= 0) return; // La deuda ya está saldada
        const cantidadAPagar = Math.min(cantidadDeuda, acreedor.cantidad);
        // Crear la descripción de la deuda
        deudasCalculadas.push(
            `${deudor.usuario} le debe $${cantidadAPagar.toFixed(2)} a ${acreedor.usuario}`
        );
        // Actualizar cantidades pendientes
        cantidadDeuda -= cantidadAPagar;
        acreedor.cantidad -= cantidadAPagar;
        });
    });
    setDeudas(deudasCalculadas);
    
  };

  const cerrarGrupo = async () => {
    const token = localStorage.getItem("token");
    const url = `https://two024-qwerty-back-2.onrender.com/api/grupos/${grupo.id}/cerrar`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log("Grupo cerrado exitosamente");
      calcularDeudas();
      setGrupoSeleccionado({ nombre: grupo.nombre, id: grupo.id , estado: false});
    } catch (error) {
      console.error("Error al cerrar el grupo:", error);
    }
  };



  return (
    <Modal
      isOpen={isModalDetallesGrupoOpen}
      onRequestClose={closeModalDetallesGrupo}
      contentLabel="Detalle"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        {grupo.nombre}
      </div>
      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Transacciones</h3>
          {isLoading ? (
            <p>Cargando transacciones...</p>
          ) : transacciones.length > 0 ? (
            <ul>
              {transacciones.map((transaccion) => (
                <li key={transaccion.id} className="py-1">
                  {transaccion.motivo} - ${transaccion.valor}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay transacciones disponibles.</p>
          )}
          {grupo.estado && (
            <button
              onClick={cerrarGrupo}
              className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-600 transition-colors duration-300 mt-4"
            >
              Finalizar Evento
            </button>
          )}
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300 mt-4"
          >
            Cerrar
          </button>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Deudas</h3>
            <ul>
              {deudas.map((deuda, index) => (
                <li key={index} className="py-1">
                  {deuda}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalVerDetallesGrupo;

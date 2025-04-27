import Modal from "react-modal";
import "./styles/ModalForm.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransaccionesTable from "./TransaccionesTable";
import ModalForm from "./ModalForm";

function ModalTransaccionesRecurrentes({
  isModalRecurrentesOpen,
  closeModalRecurrentes,
  checkIfValidToken,
  payCategories,
  monedas,
  getTransacciones
}) {
  const [modalError, setModalError] = useState("");
  const [error, setError] = useState(null);
  const [transaccionesRecurrentes, setTransaccionesRecurrentes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [selectedPayMethod, setSelectedPayMethod] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transaccionId, setTransaccionId] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [payOptions, setPayOptions] = useState([
      { value: "Tarjeta de credito", label: "Tarjeta de credito" },
      { value: "Tarjeta de Debito", label: "Tarjeta de debito" },
      { value: "Efectivo", label: "Efectivo" },
    ]);
  const [tipoGasto, setTipoGasto] = useState("Efectivo");
  const [monedaSeleccionada, setMonedaSeleccionada] = useState(1);
  const [frecuenciaRecurrente, setFrecuenciaRecurrente] = useState("");
  const [esRecurrente, setEsRecurrente] = useState(false);

  const getTransaccionesRecurrentes = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      let url = `https://two024-qwerty-back-1.onrender.com/api/transacciones/user/recurrent`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransaccionesRecurrentes(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
      }
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    //clearForm();
    //setEdit(false);
  };

  useEffect(() => {
    if (isModalRecurrentesOpen) {
      getTransaccionesRecurrentes();
    }
  }, [isModalRecurrentesOpen]);

  const closeWindow = () => {
    setModalError("");
    closeModalRecurrentes();
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleMotivoChange = (e) => {
    setMotivo(e.target.value);
  };
  const handleCategoryChange = (value) => {
    setCategoria(value ? value.value : "");
    setSelectedCategory(value);
  };
  const handlePayChange = (value) => {
    setTipoGasto(value ? value.value : "");
    setSelectedPayMethod(value);
  };

  const editRow = (row) => {
    setEdit(true);
    setMotivo(row.motivo);
    setValor(row.montoOriginal);
    let monedaDeTransac = monedas.find(m => m.label == row.monedaOriginal)
    setMonedaSeleccionada(monedaDeTransac.value);
    const selectedOption = payOptions.find(
      (option) => option.value === row.tipoGasto
    );
    setSelectedPayMethod(selectedOption || null);
    const selectedPayCategory = payCategories.find(
      (option) => option.value == row.categoria
    );
    setSelectedCategory(selectedPayCategory || null);
    setFecha(row.fecha);
    setTransaccionId(row.id);
    setEsRecurrente(true);
    setFrecuenciaRecurrente(row.frecuenciaRecurrente);
    openModal();
  };

  const deleteRow = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-1.onrender.com/api/transacciones/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTransaccionesRecurrentes(transaccionesRecurrentes.filter((t) => t.id !== id));
      } else {
        setError("Error al eliminar la transacción");
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };
  const agregarTransaccion = async (e, categoria) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let montoOriginal = valor;
    let moneda = monedas.find(m => m.value == monedaSeleccionada);
    let monedaOriginal = moneda.label;
    let valorAux = valor * moneda.value;
    let url = `https://two024-qwerty-back-1.onrender.com/api/transacciones/${transaccionId}`;
    let bodyJson = JSON.stringify({ 
        motivo, 
        valor: valorAux, 
        fecha, 
        categoria, 
        tipoGasto, 
        monedaOriginal, 
        montoOriginal, 
        frecuenciaRecurrente: esRecurrente ? frecuenciaRecurrente : null
    });
    const method = "PUT";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: bodyJson,
      });
      if (response.ok) {
        console.log("la respuesta fue ok");
        const data = await response.json();
        const updatedTransacciones = transaccionesRecurrentes.map((t) =>
          t.id === data.id ? data : t
        );
        updatedTransacciones.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setTransaccionesRecurrentes(updatedTransacciones);
        getTransacciones();
        closeModal();
      } else {
        console.log("la respuesta no fue ok");
      }
    } catch (err) {
      console.log("la respuesta fue error");
      console.log(err);
    }
  };
  const handleCreateCat = async (nombre, icono) => {
    const token = localStorage.getItem("token");
    if (!nombre || !icono) {
      console.error("Nombre y icono son obligatorios");
      return;
    }
    try {
      const inputValue = {
        nombre: nombre,
        iconPath: icono,
      };
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/personal-categoria",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inputValue),
        }
      );
      if (response.ok) {
        const newCategoria = await response.json();
        const newOption = {
          label: newCategoria.nombre,
          value: newCategoria.nombre,
          iconPath: newCategoria.iconPath,
        };
        setPayCategories((prevOptions) => [...prevOptions, newOption]);
        setSelectedCategory(newOption);
        setCategoria(newCategoria.nombre);
      } else {
        const errorMessage = await response.text();
        console.error("Error al agregar categoria:", errorMessage);
        return "La categoria ya existe";
      }
    } catch (error) {
      console.error("Error al agregar categoria personalizada:", error);
      return "";
    }
    return "";
  };

  const handleCreateTP = async (inputValue) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-1.onrender.com/api/personal-tipo-gasto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inputValue),
        }
      );

      if (response.ok) {
        const newTipoGasto = await response.json();
        const newOption = {
          label: newTipoGasto.nombre,
          value: newTipoGasto.nombre,
        };
        setPayOptions((prevOptions) => [...prevOptions, newOption]);
        setSelectedPayMethod(newOption);
        setTipoGasto(newTipoGasto.nombre);
      }
    } catch (error) {
      console.error("Error al agregar el tipo de gasto personalizado:", error);
    }
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
      maxWidth: "550px",
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
      isOpen={isModalRecurrentesOpen}
      onRequestClose={closeModalRecurrentes}
      contentLabel="Mis Transacciones Recurrentes"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        {transaccionesRecurrentes.motivo}
        </div>
        <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
            <h3 className="text-lg font-semibold mb-2">Transacciones</h3>
            {isLoading ? (
            <p>Cargando transacciones...</p>
            ) : transaccionesRecurrentes.length > 0 ? (
            <TransaccionesTable
                transacciones={transaccionesRecurrentes}
                payCategories={payCategories}
                editRow={editRow}
                deleteRow={deleteRow}
            />
            ) : (
            <p>No hay transacciones Recurrentes registradas.</p>
            )}
            <div className="flex justify-end gap-4 mt-4">
            <button
                onClick={closeWindow}
                className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300 mt-4"
            >
                Cerrar
            </button>
            </div>
        </div>
        </div>
        <ModalForm
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        agregarTransaccion={agregarTransaccion}
        edit={edit}
        motivo={motivo}
        valor={valor}
        fecha={fecha}
        handleMotivoChange={handleMotivoChange}
        setValor={setValor}
        selectedCategory={selectedCategory}
        payCategories={payCategories}
        handleCategoryChange={handleCategoryChange}
        handleCreateCat={handleCreateCat}
        setFecha={setFecha}
        handlePayChange={handlePayChange}
        selectedPayMethod={selectedPayMethod}
        payOptions={payOptions}
        handleCreateTP={handleCreateTP}
        handleGroupChange={null}
        selectedGroup={[]}
        grupos={null}
        monedas={monedas}
        monedaSeleccionada={monedaSeleccionada}
        setMonedaSeleccionada={setMonedaSeleccionada}
        frecuenciaRecurrente={frecuenciaRecurrente}
        setFrecuenciaRecurrente={setFrecuenciaRecurrente}
        esRecurrente={esRecurrente}
        setEsRecurrente={setEsRecurrente}
        lectura={true}
      />
    </Modal>
  );
}

export default ModalTransaccionesRecurrentes;

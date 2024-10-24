import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

function ModalSendPayment({ isModalOpen = false, payCategories }) {
  const defaultMediosDePago = [
    {
      value: "Tarjeta de credito",
      label: "Tarjeta de credito",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Tarjeta de Debito",
      label: "Tarjeta de debito",
      textColor: "mr-2 text-yellow-500",
    },
    { value: "Efectivo", label: "Efectivo", textColor: "mr-2 text-yellow-500" },
  ];
  const [payOption, setPayOption] = useState("");
  const [motivo, setMotivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [payOptions, setPayOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [emailReceptor, setEmailReceptor] = useState("");
  const [valor, setValor] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [modalError, setModalError] = useState("");
  const idReserva = 0;

  const fetchPersonalTipoGastos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/personal-tipo-gasto",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const customOptions = data.map((tipo) => ({
          label: tipo.nombre,
          value: tipo.nombre,
          textColor: "mr-2 text-white",
        }));
        setPayOptions([...defaultMediosDePago, ...customOptions]);
      }
    } catch (error) {
      console.error(
        "Error al obtener los tipos de gasto personalizados:",
        error
      );
    }
  };

  useEffect(() => {
    fetchPersonalTipoGastos();
  }, []);

  const validateForm = () => {
    if (!emailReceptor || !motivo || !valor || !fecha) {
      setModalError("Todos los campos son obligatorios.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailReceptor)) {
      setModalError("Ingrese un email válido.");
      return false;
    }
    if (valor <= 0) {
      setModalError("El valor debe ser mayor que 0.");
      return false;
    }
    setModalError("");
    return true;
  };
  const userExists = async (mail) => {
    let url =
      "https://two024-qwerty-back-2.onrender.com/api/public/exists/" + mail;
    const response = await fetch(url);
    if (response.ok) {
      const exists = await response.json();
      return exists;
    } else {
      console.error("Error al verificar el usuario");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const transaccion = {
      valor: valor,
      email: emailReceptor,
      motivo: motivo,
      id_reserva: "Cobro",
      fecha: fecha,
    };
    if (await userExists(emailReceptor)) {
      console.log("vino aca igual");
      if (validateForm()) {
        const response = await fetch(
          "https://two024-qwerty-back-2.onrender.com/api/transaccionesPendientes/askPayUser",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transaccion),
          }
        );
        if (response.ok) {
          console.log("Pago enviado");
        }
        cleanForm();
        document.getElementById("generatePayModal").close();
      }
    } else {
      setModalError("El mail no pertenece a un usuario de este sitio");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setCategoria(selectedValue);
    setSelectedCategory(
      payCategories.find((cat) => cat.value === selectedValue)
    );
  };

  const cleanForm = () => {
    setEmailReceptor("");
    setMotivo("");
    setValor(0);
    setPayOption("");
    setCategoria("");
    setFecha(new Date().toISOString().split("T")[0]);
  };

  return (
    <dialog
      id="generatePayModal"
      className={`modal ${isModalOpen ? "open" : ""}`}
    >
      <div className="modal-box bg-black">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-100">
          Generar Cobro
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-100 mb-6">E-Mail:</label>
            <input
              type="text"
              value={emailReceptor}
              onChange={(e) => setEmailReceptor(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-warning rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-100 mb-6">Motivo:</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-warning rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-100 mb-6">Valor:</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-warning rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-100 mb-6">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-warning rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          {modalError && (
            <div className="text-red-500 text-sm text-center">{modalError}</div>
          )}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn mr-2"
              onClick={() => {
                cleanForm();
                document.getElementById("generatePayModal").close();
              }}
            >
              Cerrar
            </button>
            <button type="submit" className="btn bg-yellow-500 text-black">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ModalSendPayment;

import React, { useEffect, useState } from "react";
import ActionButtons from "./components/ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "./styles/ProfilePage.css";
import logo from "../assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteMedioDePago from "./components/ConfirmDeleteMedioDePago";
import ModalMedioDePago from "./components/ModalMedioDePago";
import ModalMonedas from "./components/ModalMonedas";
import MonthlyGraphic from "./components/MonthlyGraphic";
import LoadingSpinner from "./components/LoadingSpinner";

function ProfilePage() {
  library.add(fas);
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
  const defaultMonedas = [
    { value: 1, label: "ARG", textColor: "mr-2 text-yellow-500" }, 
    { value: 1250, label: "USD", textColor: "mr-2 text-yellow-500" }, 
    { value: 1300, label: "EUR", textColor: "mr-2 text-yellow-500" }, 
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payOptions, setPayOptions] = useState([]);
  const [isModalMonedaOpen, setIsModalMonedaOpen] = useState(false);
  const [monedas, setMonedas] = useState([]);
  const [editPayOption, setEditPayOption] = useState({});
  const [editMoneda, setEditMoneda] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [transacciones, setTransacciones] = useState([]);
  const [loadingGraphic, setLoadingGraphic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pagoOmoneda, setPagoOmoneda] = useState("");
  const [showNoGraphs, setShowNoGraphs] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getTransacciones();
    setLoadingGraphic(false);
  }, []);
  const getTransacciones = async () => {
    setIsLoading(true);
    setLoadingGraphic(true);
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      let url = `https://two024-qwerty-back-1.onrender.com/api/transacciones/user/filter`;
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
        setTransacciones(data.transaccionesFiltradas);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoadingGraphic(false);
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };
  const checkIfValidToken = async (token) => {
    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/transacciones/userTest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        //entra aca si pasa la autenticacion
        return true; //si esta activo tengo que devolver true
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  };
  const fetchPersonalTipoGastos = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      try {
        const response = await fetch(
          "https://two024-qwerty-back-1.onrender.com/api/personal-tipo-gasto",
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
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
    setIsLoading(false);
  };

  const fetchPersonalMonedas = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      try {
        const response = await fetch(
          "https://two024-qwerty-back-1.onrender.com/api/personal-moneda",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const customMonedas = data.map((moneda) => ({
            label: moneda.nombre,
            value: moneda.valor,
            textColor: "mr-2 text-white",
          }));
          console.log(data);
          setMonedas([...defaultMonedas, ...customMonedas]);
        }
      } catch (error) {
        console.error(
          "Error al obtener las Monedas personalizados:",
          error
        );
      }
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
    console.log(monedas);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPersonalTipoGastos();
    fetchPersonalMonedas();
    console.log(monedas);
  }, []);

  const handleEdit = async (medioPagoValue, newName) => {
    const token = localStorage.getItem("token");
    const jsonResp = {
      nombreActual: medioPagoValue.label,
      nombreNuevo: newName,
    };

    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/personal-tipo-gasto/editar",
        {
          method: "POST", // Cambiado a POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jsonResp),
        }
      );

      if (response.ok) {
        setPayOptions([]); // Limpiar las opciones
        await fetchPersonalTipoGastos(); // Volver a obtener los tipos de gasto actualizados
        setIsModalOpen(false); // Cerrar el modal después de editar
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (medioPagoValue) => {
    const token = localStorage.getItem("token");
    setConfirmDeleteOpen(false);
    setLoadingGraphic(true);
    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/personal-tipo-gasto/eliminar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(medioPagoValue), // Enviamos directamente el nombre como string
        }
      );

      if (response.ok) {
        setPayOptions([]); // Limpiar las opciones
        await fetchPersonalTipoGastos(); // Volver a obtener los tipos de gasto actualizados
        await getTransacciones();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingGraphic(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setItemToDelete({});
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
      }
    } catch (error) {
      console.error("Error al agregar el tipo de gasto personalizado:", error);
    }
  };

  const confirmDelete = (medioPagoValue) => {
    setConfirmDeleteOpen(true);
    setItemToDelete(medioPagoValue);
  };

  const handleCreateMoneda = async (nombre, valor) => {
    const nombreExiste = monedas.some(
      (moneda) => moneda.label.toLowerCase() === nombre.toLowerCase()
    );
  
    if (nombreExiste) {
      throw new Error("Ya existe una moneda con ese nombre.");
      return;
    }
    const token = localStorage.getItem("token");
    console.log(nombre + "   estaaa " + valor);
    try {
      const response = await fetch(
        `https://two024-qwerty-back-1.onrender.com/api/personal-moneda`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({ nombre, valor }),
        }
      );
      console.log(response);
      if (response.ok) {
        const newMoneda = await response.json();
        const newOption = {
          label: newMoneda.nombre,
          value: newMoneda.valor,
        };
        setMonedas((prevOptions) => [...prevOptions, newOption]);
        //setSelectedPayMethod(newOption);
      }
    } catch (error) {
      console.error("Error al agregar la moneda personalizada:", error);
    }
  };

  const handleEditMoneda = async (editMoneda, nuevoNombre, nuevoValor) => {
    const nombreExiste = monedas.some(
      (moneda) =>
        moneda.label.toLowerCase() === nuevoNombre.toLowerCase() &&
        moneda.label.toLowerCase() !== editMoneda.label.toLowerCase()
    );
  
    if (nombreExiste) {
      throw new Error("Ya existe una moneda con ese nombre.");
      return;
    }
    const token = localStorage.getItem("token");
    const jsonResp = {
      nombreActual: editMoneda.label,
      nombreNuevo: nuevoNombre,
      valorActual: editMoneda.value,
      valorNuevo: nuevoValor,
    };

    try {
      const response = await fetch(
        `https://two024-qwerty-back-1.onrender.com/api/personal-moneda`,
        {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jsonResp),
        }
      );

      if (response.ok) {
        setMonedas([]); 
        await fetchPersonalMonedas(); 
        setIsModalMonedaOpen(false); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMoneda = async (monedaNombre) => {
    const token = localStorage.getItem("token");
    setConfirmDeleteOpen(false);
    setLoadingGraphic(true);
    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/personal-moneda",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre: monedaNombre }), // Enviamos directamente el nombre como string
        }
      );

      if (response.ok) {
        setMonedas([]);
        await fetchPersonalMonedas();
        await getTransacciones();
      }
    } catch (err) {
      console.log("Error al eliminar moneda", err);
    } finally {
      setLoadingGraphic(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black py-10">
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mi Cuenta
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-yellow-600">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4">
        <div className="m-4">
          <ActionButtons />
        </div>
        <>
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-500 flex justify-center items-center z-50">
              <div className="flex items-center justify-center">
                <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
              </div>
            </div>
          )}
          {loadingGraphic ? ( // Muestra el spinner si está cargando
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Primera columna */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full md:w-1/2">
                <div className="font-bold text-yellow-500 text-xl text-center mb-4">
                  Mis Medios De Pago
                </div>
                <ul>
                  {defaultMediosDePago.map((medioDePago) => (
                    <li
                      key={medioDePago.value}
                      className="bg-gray-700 p-3 rounded-md shadow mb-3"
                    >
                      <div className="flex items-center">
                        <div className={medioDePago.textColor}>
                          {medioDePago.label}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <ul>
                  {payOptions.slice(3).map((medioDePago) => (
                    <li
                      key={medioDePago.value}
                      className="bg-gray-700 p-3 rounded-md shadow mb-3 flex justify-between"
                    >
                      <div className="flex items-center">
                        <div className={medioDePago.textColor}>
                          {medioDePago.label}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => {
                            setEditPayOption(medioDePago);
                            setIsEditMode(true);
                            setIsModalOpen(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            confirmDelete(medioDePago.value);
                            setPagoOmoneda("pago");
                          }}
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-700"
                  onClick={() => {
                    setEditPayOption({});
                    setIsEditMode(false);
                    setIsModalOpen(true);
                  }}
                >
                  Agregar Medio de Pago
                </button>
              </div>

              {/* Segunda columna (idéntica o modificada si querés que muestre otra cosa) */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full md:w-1/2">
                <div className="font-bold text-yellow-500 text-xl text-center mb-4">
                  Mis Monedas
                </div>
                <ul>
                  {defaultMonedas.map((moneda) => (
                    <li
                      key={moneda.label}
                      className="bg-gray-700 p-3 rounded-md shadow mb-3 flex justify-between"
                    >
                      <span className={`w-1/3 text-left ${moneda.textColor}`}>{moneda.label}</span>
                      <span className={`w-1/3 text-center ${moneda.textColor}`}>${moneda.value}</span>
                      <span className={`w-1/3 text-right ${moneda.textColor}`}></span>
                    </li>
                  ))}
                </ul>
                <ul>
                  {monedas.slice(3).map((moneda) => (
                    <li
                      key={moneda.label}
                      className="bg-gray-700 p-3 rounded-md shadow mb-3 flex justify-between"
                    >
                      <span className={moneda.textColor}>{moneda.label}</span>
                      <span className={moneda.textColor}>${moneda.value}</span>
                      <div className="flex items-center">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => {
                            setEditMoneda(moneda);
                            setIsEditMode(true);
                            setIsModalMonedaOpen(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            confirmDelete(moneda.label);
                            setPagoOmoneda("moneda");
                          }}
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-700"
                  onClick={() => {
                    setEditPayOption({});
                    setIsEditMode(false);
                    setIsModalMonedaOpen(true);
                  }}
                >
                  Agregar Moneda
                </button>
              </div>
            </div>

          )}

          {showNoGraphs && (
            <div className="flex items-center">
              <h2 className="text-2xl py-2 font-bold text-gray-100">
                Monto por Medio de Pago
              </h2>
            </div>
          )}

          {!loadingGraphic && showNoGraphs && (
            <>
            <MonthlyGraphic
              type="tipoGasto"
              transacciones={transacciones}
              payCategories={payOptions}
              loading={loadingGraphic}
              setShowNoGraphs={setShowNoGraphs}
            />
            <div className="mt-6">
            {transacciones[0] != null && (
              <div className="flex items-center">
                <h2 className="text-2xl py-2 font-bold text-gray-100">
                  Monto por Moneda Utilizada
                </h2>
              </div>
            )}
                <MonthlyGraphic
                  type="monedas"
                  transacciones={transacciones}
                  payCategories={payOptions}
                  loading={loadingGraphic}
                  setShowNoGraphs={setShowNoGraphs}
                />
              </div>
            </>
          )}
        </>
      </div>
      <ModalMedioDePago
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        handleCreateTP={handleCreateTP}
        handleEditTP={handleEdit}
        edit={isEditMode}
        editTP={editPayOption}
      />
      <ConfirmDeleteMedioDePago
        isOpen={confirmDeleteOpen}
        handleClose={cancelDelete}
        handleDelete={() => {
          if (pagoOmoneda === "pago") {
            handleDelete(itemToDelete);
          } else {
            handleDeleteMoneda(itemToDelete);
          }
        }}
        pagoOmoneda={pagoOmoneda}
      />
      <ModalMonedas
        isOpen={isModalMonedaOpen}
        onRequestClose={() => setIsModalMonedaOpen(false)}
        handleCreateMoneda={handleCreateMoneda}
        handleEditMoneda={handleEditMoneda}
        edit={isEditMode}
        editMoneda={editMoneda}
      />
    </div>
  );
}

export default ProfilePage;

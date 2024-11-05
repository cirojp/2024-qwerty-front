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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payOptions, setPayOptions] = useState([]);
  const [editPayOption, setEditPayOption] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [transacciones, setTransacciones] = useState([]);
  const [loadingGraphic, setLoadingGraphic] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getTransacciones();
    setLoadingGraphic(false);
  }, []);
  const getTransacciones = async () => {
    setLoadingGraphic(true);
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      let url = `https://two024-qwerty-back-2.onrender.com/api/transacciones/user/filter`;
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
        setTransacciones(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoadingGraphic(false);
      }
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
  };
  const checkIfValidToken = async (token) => {
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/transacciones/userTest",
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
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
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
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchPersonalTipoGastos();
  }, []);

  const handleEdit = async (medioPagoValue, newName) => {
    const token = localStorage.getItem("token");
    const jsonResp = {
      nombreActual: medioPagoValue.label,
      nombreNuevo: newName,
    };

    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/personal-tipo-gasto/editar",
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
        "https://two024-qwerty-back-2.onrender.com/api/personal-tipo-gasto/eliminar",
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
        `https://two024-qwerty-back-2.onrender.com/api/personal-tipo-gasto`,
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 py-10">
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mi Cuenta
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-yellow-600">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="flex flex-col flex-grow px-4">
      {loadingGraphic ? ( // Muestra el spinner si está cargando
          <LoadingSpinner />
        ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
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
                    onClick={() => confirmDelete(medioDePago.value)}
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
        )}
        <div className="flex items-center">
          <h2 className="text-2xl py-2 font-bold text-gray-100">
            Monto por Medio de Pago
          </h2>
          
        </div>
        
        <MonthlyGraphic
          type="tipoGasto"
          transacciones={transacciones}
          payCategories={payOptions}
          loading={loadingGraphic}
        />
        <div className="m-4">
          <ActionButtons />
        </div>
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
          handleDelete(itemToDelete);
        }}
      />
    </div>
  );
}

export default ProfilePage;

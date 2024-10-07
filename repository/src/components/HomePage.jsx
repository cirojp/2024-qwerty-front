import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransaccionesTable from "./TransaccionesTable";
import ModalForm from "./ModalForm";
import "./styles/HomePage.css";
import logo from "../assets/logo-removebg-preview.png";
import AlertPending from "./AlertPending";

function HomePage() {
  const [transacciones, setTransacciones] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [showNoTransactions, setShowNoTransactions] = useState(false);
  const [valor, setValor] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [tranPendiente, setTranPendiente] = useState({});
  const [categoria, setCategoria] = useState("");
  const [payCategories, setPayCategories] = useState([]);
  const [payCategoriesDefault, setPayCategoriesDefault] = useState([
    {
      value: "Impuestos y Servicios",
      label: "Impuestos y Servicios",
      iconPath: "fa-solid fa-file-invoice-dollar",
    },
    {
      value: "Entretenimiento y Ocio",
      label: "Entretenimiento y Ocio",
      iconPath: "fa-solid fa-ticket",
    },
    {
      value: "Hogar y Mercado",
      label: "Hogar y Mercado",
      iconPath: "fa-solid fa-house",
    },
    { value: "Antojos", label: "Antojos", iconPath: "fa-solid fa-candy-cane" },
    {
      value: "Electrodomesticos",
      label: "Electrodomesticos",
      iconPath: "fa-solid fa-blender",
    },
    { value: "Clase", label: "Clase", iconPath: "fa-solid fa-chalkboard-user" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaccionId, setTransaccionId] = useState(null);
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [categoriasConTodas, setCategoriasConTodas] = useState([]);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [pendTran, setPendTran] = useState(false);

  useEffect(() => {
    getTransacciones();
  }, []);
  useEffect(() => {
    if (payCategories.length > 0) {
      setCategoriasConTodas([
        { value: "Todas", label: "Todas" },
        { value: "Otros", label: "Otros" },
        ...payCategories,
      ]);
    }
  }, [payCategories]);

  const showTransactionsPendientes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/transaccionesPendientes/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data[0]);
      if (data[0] != null) {
        setTranPendiente(data[0]);
        setPendTran(true);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoadingFilter(false);
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
  const getTransacciones = async (filtrado = "Todas") => {
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      let url = "";
      if (filtrado === "Todas") {
        url =
          "https://two024-qwerty-back-2.onrender.com/api/transacciones/user";
      } else {
        url = `https://two024-qwerty-back-2.onrender.com/api/transacciones/user/filter?categoria=${filtrado}`;
      }
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
        setIsLoadingFilter(false);
      }
      fetchPersonalCategorias();
      showTransactionsPendientes();
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
  };

  const fetchPersonalCategorias = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/personal-categoria",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const customOptions = data.map((cat) => ({
          label: cat.nombre,
          value: cat.nombre,
          iconPath: cat.iconPath,
        }));
       
        setPayCategories([...payCategoriesDefault, ...customOptions]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías personalizadas:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
    setEdit(false);
  };

  const clearForm = () => {
    setMotivo("");
    setValor("");
    setFecha(new Date().toISOString().split("T")[0]);
    setSelectedCategory(null);
  };

  const editRow = (row) => {
    setEdit(true);
    setMotivo(row.motivo);
    setValor(row.valor);
    const selectedPayCategory = payCategories.find(
      (option) => option.value == row.categoria
    );
    setSelectedCategory(selectedPayCategory || null);
    setFecha(row.fecha);
    setTransaccionId(row.id);
    openModal();
  };

  const isAccepted = async (transaction) => {
    await aceptarTransaccion(transaction, "Clase");
    eliminarTransaccionPendiente(transaction.id);
    enviarRespuesta("aceptada", transaction.id_reserva);
    setPendTran(false);
  };

  const isRejected = (transaction) => {
    eliminarTransaccionPendiente(transaction.id);
    enviarRespuesta("rechazada", transaction.id_reserva);
    setPendTran(false);
  };
  const enviarRespuesta = async (resp, id_reserva) => {
    const token = localStorage.getItem("token");
    const url = `https://two024-qwerty-back-2.onrender.com/api/transaccionesPendientes/${resp}?id_reserva=${id_reserva}`;
    const method = "POST";
    try {
      //hacer chequeos de que pase bien las cosas en el back!
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        //
      }
    } catch (err) {
      // habria que avisar que hubo un error en aceptar la transaccion o algo
    }
  };
  const aceptarTransaccion = async (transaccion, categoria) => {
    const token = localStorage.getItem("token");
    const url = "https://two024-qwerty-back-2.onrender.com/api/transacciones";
    const method = "POST";
    let motivo = transaccion.motivo;
    let valor = transaccion.valor;
    let fecha = transaccion.fecha;
    try {
      //hacer chequeos de que pase bien las cosas en el back!
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo, valor, fecha, categoria }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedTransacciones = [...transacciones, data];
        updatedTransacciones.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setTransacciones(updatedTransacciones);
      }
    } catch (err) {
      // habria que avisar que hubo un error en aceptar la transaccion o algo
    }
  };
  const agregarTransaccion = async (e, categoria) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = edit
      ? `https://two024-qwerty-back-2.onrender.com/api/transacciones/${transaccionId}`
      : "https://two024-qwerty-back-2.onrender.com/api/transacciones";

    const method = edit ? "PUT" : "POST";

    try {
      if (valor <= 0) {
        setModalError("El valor debe ser mayor a 0");
        return;
      }
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo, valor, fecha, categoria }),
      });

      if (response.ok) {
        const data = await response.json();
        if (edit) {
          const updatedTransacciones = transacciones.map((t) =>
            t.id === data.id ? data : t
          );
          setTransacciones(updatedTransacciones);
        } else {
          const updatedTransacciones = [...transacciones, data];
          updatedTransacciones.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );
          setTransacciones(updatedTransacciones);
        }
        setModalError("");
        closeModal();
      } else {
        setModalError("Error al agregar o actualizar la transacción");
      }
    } catch (err) {
      setModalError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  const deleteRow = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-2.onrender.com/api/transacciones/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTransacciones(transacciones.filter((t) => t.id !== id));
      } else {
        setError("Error al eliminar la transacción");
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };
  const eliminarTransaccionPendiente = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://two024-qwerty-back-2.onrender.com/api/transaccionesPendientes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        showTransactionsPendientes();
      } else {
        //poner algun error?
      }
    } catch (err) {
      //poner algun error?
      //setError("Ocurrió un error. Intenta nuevamente.");
    }
  };
  const handleMotivoChange = (e) => {
    setMotivo(e.target.value);
  };
  const handleCategoryChange = (value) => {
    setCategoria(value ? value.value : "");
    setSelectedCategory(value);
  };

  const handleCreateCat = async (nombre, icono) => {
    console.log("entre      ");
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
        "https://two024-qwerty-back-2.onrender.com/api/personal-categoria",
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
        console.log(payCategories);
        setSelectedCategory(newOption);
        setCategoria(newCategoria.nombre);
      } else {
        const errorMessage = await response.text();
        console.error("Error al agregar categoria:", errorMessage);
        console.log("la categoria existeeeeeeeeeee");
        return "La categoria ya existe";
      }
    } catch (error) {
      console.error("Error al agregar categoria personalizada:", error);
      return "";
    }
    return "";
  };
  const handleChange = (event) => {
    setIsLoadingFilter(true);
    let cat = event.target.value;
    setCategoriaSeleccionada(cat);
    getTransacciones(cat);
  };

  return (
    <div className="container min-h-screen min-w-full max-w-full bg-black">
      <div className="bg-black flex items-center justify-center w-full">
        <div className="grid grid-cols-3 grid-rows-2 gap-0 w-full">
          <div className="flex items-center px-8">
            {" "}
            {/* Ajustar tamaño del logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-yellow-600">
              {" "}
              {/* Cambié de w-24 a w-16 para pantallas pequeñas */}
              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div></div>
          <div className="flex justify-end items-center px-4 md:px-20">
            {" "}
            {/* Ajustar padding */}
            <button
              className="w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
              onClick={() => navigate("/profile")}
            >
              Mi Cuenta
            </button>
          </div>
          <div className="flex justify-start items-center px-6">
            <h2 className="text-2xl py-2 font-bold text-gray-100">
              Historial de Transacciones
            </h2>
          </div>
          <div className="flex justify-center items-center py-4">
            <button
              className="bg-yellow-500 bg-opacity-80 text-gray-900 py-4 px-6 rounded-lg hover:bg-red-700 w-full md:w-auto text-xl"
              onClick={openModal}
            >
              Agregar Transacción
            </button>
          </div>
          <div className="flex justify-end items-center px-4 md:px-6">
            {" "}
            {/* Ajustamos el padding en pantallas pequeñas */}
            <div className="flex flex-col">
              <label
                htmlFor="categorias"
                className="mb-2 text-lg font-medium text-gray-200"
              >
                Filtrar por categoría:
              </label>
              <select
                id="categorias"
                value={categoriaSeleccionada}
                onChange={handleChange}
                className="block w-full md:w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoriasConTodas.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {isLoadingFilter ? (
        <div className="flex justify-center items-center">
          {/* Spinner o ícono de carga */}
          <svg
            className="animate-spin h-10 w-10 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.965 7.965 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-yellow-500 font-bold ml-2">Cargando...</span>
        </div>
      ) : (
        <>
          {/* Mostrar la tabla de transacciones si no está cargando */}
          <TransaccionesTable
            transacciones={transacciones}
            payCategories={payCategories}
            editRow={editRow}
            deleteRow={deleteRow}
            onTableEmpty={() => setShowNoTransactions(true)}
            onTransactions={() => setShowNoTransactions(false)}
          />

          {/* Si no hay transacciones para mostrar */}
          {showNoTransactions && (
            <div className="flex flex-col justify-center mb-0 items-center">
              {categoriaSeleccionada !== "Todas" && (
                <p className="text-red-500 font-bold mb-4">
                  Su filtro no coincide con ninguna transacción
                </p>
              )}
              <button
                className="bg-yellow-500 bg-opacity-80 text-gray-950 font-extrabold py-6 px-16 rounded-lg hover:bg-yellow-700"
                onClick={openModal}
              >
                Ingrese una transacción
              </button>
            </div>
          )}
        </>
      )}
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
      />
      <AlertPending
        isOpen={pendTran}
        pendingTransaction={tranPendiente}
        isAccepted={isAccepted}
        isRejected={isRejected}
      />
    </div>
  );
}

export default HomePage;

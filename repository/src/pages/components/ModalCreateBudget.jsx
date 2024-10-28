import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

function ModalCreateBudget({ closeModal = () => {} }) {
  library.add(fas);
  const [payCategories, setPayCategories] = useState([]);
  const [formMessage, setFormMessage] = useState("");
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
    {
      value: "Ingreso de Dinero",
      label: "Ingreso de Dinero",
      iconPath: "fa-solid fa-money-bill",
    },
  ]);

  const [budgetValues, setBudgetValues] = useState({});
  const [totalBudget, setTotalBudget] = useState("");
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    fetchPersonalCategorias();
  }, []);

  const handleInputChange = (value, category) => {
    const numericValue = parseFloat(value);
    setBudgetValues((prevValues) => ({
      ...prevValues,
      [category]: numericValue,
    }));

    // Validación en tiempo real: valor menor que 0
    setErrors((prevErrors) => ({
      ...prevErrors,
      [category]: numericValue < 0 ? "El valor no puede ser negativo" : "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación de la suma de los valores de presupuesto
    const totalCategoryBudget = Object.values(budgetValues).reduce(
      (acc, curr) => acc + (curr || 0),
      0
    );

    // Mensaje de error si la suma de budgets es mayor que el total
    if (totalCategoryBudget > totalBudget) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalBudget:
          "La suma de los presupuestos no debe exceder el presupuesto total",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalBudget: "",
      }));
    }

    // Verificar si hay errores en los valores de categorías
    const hasNegativeValues = Object.values(budgetValues).some(
      (value) => value < 0
    );

    if (hasNegativeValues) {
      alert("Algunos valores de categorías son negativos. Revise los campos.");
      return;
    }

    const formData = {
      totalBudget,
      categoryBudgets: budgetValues,
    };
    createNewBudget(formData);
  };

  const createNewBudget = async (budget) => {
    const token = localStorage.getItem("token");
    console.log(JSON.stringify(budget));
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/presupuesto",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(budget),
        }
      );
      if (response.ok) {
        setFormMessage("Presupuesto creado!");
      }
    } catch (error) {}
  };

  return (
    <div className="modal-box w-full max-w-md p-6 bg-[#1E2126] rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white">
        Agregar Nuevo Presupuesto
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-white">
            <FontAwesomeIcon
              className="mr-2"
              color="#FFFFFF"
              icon="fa-solid fa-wallet"
            />
            Presupuesto Total
          </label>
          <input
            type="number"
            placeholder="Monto Total"
            className="input input-bordered w-full"
            value={totalBudget}
            onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
            required
          />
          {errors.totalBudget && (
            <p className="text-red-500 text-sm">{errors.totalBudget}</p>
          )}
        </div>

        {payCategories.map((category, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-sm font-semibold mb-1 text-white">
              <FontAwesomeIcon
                className="mr-2"
                color="#FFFFFF"
                icon={category.iconPath}
              />
              {category.label}
            </label>
            <input
              type="number"
              id={`amount-${index}`}
              placeholder={`Monto para ${category.label}`}
              className="input input-bordered w-full"
              value={budgetValues[category.value] || ""}
              onChange={(e) =>
                handleInputChange(e.target.value, category.value)
              }
            />
            {errors[category.value] && (
              <p className="text-red-500 text-sm">{errors[category.value]}</p>
            )}
          </div>
        ))}

        {formMessage && <p className="text-green-500 text-sm">{formMessage}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button type="button" className="btn btn-ghost" onClick={closeModal}>
            Cancelar
          </button>
          <button type="submit" className="btn bg-yellow-500 text-black">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalCreateBudget;

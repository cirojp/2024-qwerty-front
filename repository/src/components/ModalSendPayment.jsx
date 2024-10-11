import React, { useState } from "react";
import Select from "react-select";

function ModalSendPayment({ isModalOpen = false, payCategories }) {
  const [motivo, setMotivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [emailReceptor, setEmailReceptor] = useState("");
  const [valor, setValor] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [modalError, setModalError] = useState("");
  const handleMotivoChange = (e) => {
    setMotivo(e.target.value);
  };
  const handleValorChange = (e) => {
    setValor(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmailReceptor(e.target.value);
  };
  const handleCategoryChange = (value) => {
    setCategoria(value ? value.value : "");
    setSelectedCategory(value);
  };
  return (
    <dialog id="generatePayModal" className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-100">
          Realizar Pago
        </h2>
        <div>
          <form method="dialog">
            <div>
              <label className="text-center text-gray-100 mb-6">E-Mail:</label>
              <input
                type="text"
                value={emailReceptor}
                onChange={handleEmailChange}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="text-center text-gray-100 mb-6">Motivo:</label>
              <input
                type="text"
                value={motivo}
                onChange={handleMotivoChange}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="text-center text-gray-100 mb-6">Valor:</label>
              <input
                type="number"
                value={valor}
                onChange={handleValorChange}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="text-center text-gray-100 mb-6">
                Categoria:
              </label>
              <div className="flex items-center">
                <select className="select select-bordered mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500">
                  <option disabled selected>
                    Seleccione Categoria
                  </option>
                  {payCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {}}
                  className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="text-center text-gray-100 mb-6">Fecha:</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
            {modalError && (
              <div className="text-red-500 text-sm text-center">
                {modalError}
              </div>
            )}
            <button
              className="btn"
              onClick={() =>
                document.getElementById("generatePayModal").close()
              }
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default ModalSendPayment;

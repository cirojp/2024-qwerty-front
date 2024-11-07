import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import Achievement from "./components/Achievement";

const AchievementsPage = () => {
  const navigate = useNavigate(); // Hook para la navegación

  const achievements = [
    {
      id: 1,
      title: "Transacciones",
      description: "Crear 1 transaccion",
      img: "https://cdn-icons-png.flaticon.com/512/1875/1875506.png",
      type: "Bronce",
      completed: false,
      goal: 1,
    },
    {
      id: 2,
      title: "Transacciones",
      description: "Crear 5 transacciones",
      img: "https://cdn-icons-png.flaticon.com/512/1875/1875506.png",
      type: "Plata",
      completed: false,
      goal: 5,
    },
    {
      id: 3,
      title: "Transacciones",
      description: "Crear 10 transacciones",
      img: "https://cdn-icons-png.flaticon.com/512/1875/1875506.png",
      type: "Oro",
      completed: false,
      goal: 10,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white py-8 px-4">
      {/* Botón de regreso */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition"
        >
          Volver al Perfil
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Mis Logros
      </h1>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Achievement key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;

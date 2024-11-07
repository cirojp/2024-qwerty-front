import React, { useEffect, useState } from "react";

const Achievement = ({ achievement }) => {
  const { title, description, completed, type } = achievement;
  const [loading, setLoading] = useState(true);

  const checkIfCompleted = async () => {
    const token = localStorage.getItem("token");
    fetch(
      "https://two024-qwerty-back-2.onrender.com/api/users/userTransaction",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data >= achievement.goal) {
          achievement.completed = true;
        }
      })
      .then(() => setLoading(false));
  };

  useEffect(() => {
    checkIfCompleted();
  }, []);

  // Función para determinar el color del borde según el tipo
  const getBorderColor = (type) => {
    switch (type.toLowerCase()) {
      case "bronce":
        return "border-orange-700";
      case "plata":
        return "border-gray-400";
      case "oro":
        return "border-yellow-300";
      default:
        return "border-blue-500";
    }
  };

  const getBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "bronce":
        return "bg-orange-700 text-white";
      case "plata":
        return "bg-gray-400 text-gray-800";
      case "oro":
        return "bg-yellow-300 text-yellow-900";
      default:
        return "bg-blue-500 text-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  } else {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="card shadow-lg bg-base-100 hover:shadow-xl rounded-lg transition-shadow overflow-hidden">
          <figure className="px-6 pt-6">
            <img
              src={achievement.img}
              alt={`Achievement: ${title}`}
              className={`w-28 h-28 object-contain mx-auto border-4 rounded-full ${getBorderColor(
                type
              )}`}
            />
          </figure>
          <div className="card-body text-center px-6 py-4">
            <h2 className="card-title text-2xl font-bold text-white mb-2 justify-center">
              {title} - Nivel{" "}
              {achievement.type == "Bronce"
                ? 1
                : achievement.type == "Plata"
                ? 2
                : achievement.type == "Oro"
                ? 3
                : 4}
            </h2>
            <p className="text-sm text-gray-400">{description}</p>

            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  completed
                    ? "bg-green-500 text-green-100"
                    : "bg-orange-400 text-orange-100"
                }`}
              >
                {completed ? "Obtenido" : "No Obtenido"}
              </span>
            </div>

            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                  type
                )}`}
              >
                {type}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Achievement;

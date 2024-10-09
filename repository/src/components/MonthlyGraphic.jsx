import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

function MonthlyGraphic({ transacciones = [], payCategories }) {
  
  library.add(fas);
  // Calcular la suma por categoría
  const sumaPorCategoria = transacciones.reduce((acc, transaccion) => {
    const categoria = transaccion.categoria;

    if (!acc[categoria]) {
      acc[categoria] = 0;
    }

    acc[categoria] += transaccion.valor;

    return acc;
  }, {});

  // Preparar los datos para el gráfico
  const data = Object.entries(sumaPorCategoria).map(([categoria, monto]) => ({
    name: categoria,
    value: monto,
  }));

  // Definir los colores
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Obtener el ícono correspondiente a la categoría
  const getCategoryIcon = (categoryName) => {
    const category = payCategories.find((cat) => cat.value === categoryName);
    return category ? category.iconPath : null;
  };

  return (
    <div className="flex flex justify-center items-center py-4 bg-gray-950 h-full w-full">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      {/* Leyenda debajo del gráfico */}
      <div className="legend flex flex-col mt-4">
        {data.map((entry, index) => {
          const iconPath = getCategoryIcon(entry.name);
          return (
            <div
              key={`legend-item-${index}`}
              className="flex items-center mb-2 text-white"
            >
              {/* Ícono de la categoría */}
              {iconPath && (
                <FontAwesomeIcon
                  icon={iconPath}
                  className="mr-2"
                  style={{ color: COLORS[index % COLORS.length] }}
                />
              )}
              {/* Nombre de la categoría */}
              <span>{entry.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyGraphic;

// Función para renderizar etiquetas personalizadas en el gráfico
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

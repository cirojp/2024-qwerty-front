import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

function MonthlyGraphic({
  transacciones = [],
  type = "",
  payCategories = [],
  payOptions = [],
  filtroMes = "",
}) {
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

  const sumaPorTipoGasto = transacciones.reduce((acc, transaccion) => {
    const tipoGasto = transaccion.tipoGasto;
    if (!acc[tipoGasto]) {
      acc[tipoGasto] = 0;
    }
    acc[tipoGasto] += transaccion.valor;
    return acc;
  }, {});

  // Preparar los datos para el gráfico de pie
  const data = Object.entries(sumaPorCategoria).map(([categoria, monto]) => ({
    name: categoria,
    value: monto,
  }));

  const dataPay = Object.entries(sumaPorTipoGasto).map(
    ([tipoGasto, monto]) => ({
      name: tipoGasto,
      value: monto,
    })
  );

  // Definir los colores
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#fe1900",
    "#a500fe",
  ];

  // Obtener el ícono correspondiente a la categoría
  const getCategoryIcon = (categoryName) => {
    const category = payCategories.find((cat) => cat.value === categoryName);
    return category ? category.iconPath : null;
  };

  // Array con todos los meses
  const allMonths = Array.from({ length: 12 }, (_, index) =>
    new Date(2024, index).toLocaleString("default", { month: "short" })
  );

  // Si hay un filtro de mes, cambiar a gráfico diario
  let dataLine = [];

  if (filtroMes) {
    const selectedMonth = parseInt(filtroMes, 10) - 1;
    const gastosPorDia = transacciones.reduce((acc, transaccion) => {
      const fecha = new Date(transaccion.fecha);
      const mes = fecha.getMonth();
      if (mes === selectedMonth) {
        const dia = fecha.getDate();
        if (!acc[dia]) {
          acc[dia] = 0;
        }
        acc[dia] += transaccion.valor;
      }
      return acc;
    }, {});

    const daysInMonth = new Date(2024, selectedMonth + 1, 0).getDate();
    dataLine = Array.from({ length: daysInMonth }, (_, index) => ({
      day: (index + 1).toString(),
      total: gastosPorDia[index + 1] || 0,
    }));
  } else {
    const gastosPorMes = transacciones.reduce((acc, transaccion) => {
      const mes = new Date(transaccion.fecha).getMonth();
      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes] += transaccion.valor;
      return acc;
    }, {});

    dataLine = allMonths.map((month, index) => ({
      month,
      total: gastosPorMes[index] || 0,
    }));
  }

  return (
    <div className="flex justify-center items-center py-4 bg-gray-950 h-full w-full">
      <PieChart width={400} height={400}>
        <Pie
          data={type === "categorias" ? data : dataPay} // Usamos comparación con ===
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {(type === "categorias" ? data : dataPay).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      {/* Leyenda debajo del gráfico */}
      <div className="legend flex flex-col mt-4">
        {type === "categorias" &&
          data.map((entry, index) => {
            const iconPath = getCategoryIcon(entry.name);
            return (
              <div
                key={`legend-item-${index}`}
                className="flex items-center mb-2 text-white"
              >
                {iconPath && (
                  <FontAwesomeIcon
                    icon={iconPath}
                    className="mr-2"
                    style={{ color: COLORS[index % COLORS.length] }}
                  />
                )}
                <span>{entry.name}</span>
              </div>
            );
          })}

        {type === "tipoGasto" &&
          dataPay.map((entry, index) => {
            return (
              <div
                key={`legend-item-${index}`}
                className="flex items-center mb-2 text-white"
              >
                <span>{entry.name}</span>
              </div>
            );
          })}
      </div>

      {/* Gráfico de líneas */}
      <ResponsiveContainer width={500} height={400}>
        <LineChart data={dataLine}>
          <XAxis dataKey={filtroMes ? "day" : "month"} stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyGraphic;

// Función para renderizar etiquetas personalizadas en el gráfico de pie
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

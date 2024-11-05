import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import LoadingSpinner from "./LoadingSpinner";

function MonthlyGraphic({
  transacciones = [],
  type = "",
  payCategories = [],
  payOptions = [],
  filtroMes = "",
  filtroCategoria,
  loading = true,
}) {
  library.add(fas);

  // Estado para controlar si está cargando

  // Estado para los datos
  const [data, setData] = useState([]);
  const [dataPay, setDataPay] = useState([]);
  const [dataLine, setDataLine] = useState([]);
  const [loadingg, setLoadingg] = useState(true);

  useEffect(() => {
    // Procesar los datos
    const gastos =
      filtroCategoria !== "Ingreso de Dinero"
        ? transacciones.filter(
            (transaccion) => transaccion.categoria !== "Ingreso de Dinero"
          )
        : transacciones;

    const sumaPorCategoria = gastos.reduce((acc, transaccion) => {
      const categoria = transaccion.categoria;
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += transaccion.valor;
      return acc;
    }, {});

    const sumaPorTipoGasto = gastos.reduce((acc, transaccion) => {
      const tipoGasto = transaccion.tipoGasto;
      if (!acc[tipoGasto]) {
        acc[tipoGasto] = 0;
      }
      acc[tipoGasto] += transaccion.valor;
      return acc;
    }, {});

    const allMonths = Array.from({ length: 12 }, (_, index) =>
      new Date(2024, index).toLocaleString("default", { month: "short" })
    );

    let newDataLine = [];

    if (filtroMes) {
      const selectedMonth = parseInt(filtroMes, 10) - 1;
      const gastosPorDia = gastos.reduce((acc, transaccion) => {
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
      newDataLine = Array.from({ length: daysInMonth }, (_, index) => ({
        day: (index + 1).toString(),
        total: gastosPorDia[index + 1] || 0,
      }));
    } else {
      const gastosPorMes = gastos.reduce((acc, transaccion) => {
        const mes = new Date(transaccion.fecha).getMonth();
        if (!acc[mes]) {
          acc[mes] = 0;
        }
        acc[mes] += transaccion.valor;
        return acc;
      }, {});

      newDataLine = allMonths.map((month, index) => ({
        month,
        total: gastosPorMes[index] || 0,
      }));
    }

    setData(
      Object.entries(sumaPorCategoria).map(([categoria, monto]) => ({
        name: categoria,
        value: monto,
      }))
    );
    setDataPay(
      Object.entries(sumaPorTipoGasto).map(([tipoGasto, monto]) => ({
        name: tipoGasto,
        value: monto,
      }))
    );
    setDataLine(newDataLine);
    setLoadingg(false);
  }, [payCategories, transacciones, filtroMes, filtroCategoria]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#fe1900",
    "#a500fe",
  ];

  const getCategoryIcon = (categoryName) => {
    const category = payCategories.find((cat) => cat.value === categoryName);
    return category ? category.iconPath : null;
  };

  return (
    <div className="flex flex-col justify-center items-center py-4 bg-gray-950 h-full w-full">
      {loadingg ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="flex justify-center items-center md:w-1/2">
            <PieChart width={400} height={400}>
              {" "}
              {/* Aumentar tamaño del gráfico */}
              <Pie
                data={type === "categorias" ? data : dataPay}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {(type === "categorias" ? data : dataPay).map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
            </PieChart>
            <div className="legend flex flex-col">
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
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: COLORS[index % COLORS.length],
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex justify-center items-center md:w-1/2">
            <ResponsiveContainer width={300} height={300}>
              <BarChart data={dataLine}>
                <XAxis dataKey={filtroMes ? "day" : "month"} stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar type="monotone" dataKey="total" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyGraphic;

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

  const displayText = percent < 0.01 ? "<1%" : `${(percent * 100).toFixed(0)}%`;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {displayText}
    </text>
  );
};

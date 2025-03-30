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
  transaccionesSinFiltroCat,
}) {
  library.add(fas);

  // Estado para los datos
  const [data, setData] = useState([]);
  const [dataPay, setDataPay] = useState([]);
  const [dataMonedas, setDataMonedas] = useState([]);
  const [dataLine, setDataLine] = useState([]);
  const [loadingg, setLoadingg] = useState(true);
  const [transaccionesRestantes, setTransaccionesRestantes] = useState([]);

  useEffect(() => {
    const gastos =
      filtroCategoria !== "Ingreso de Dinero"
        ? transacciones.filter(
            (transaccion) => transaccion.categoria !== "Ingreso de Dinero"
          )
        : transacciones;

    if (
      filtroCategoria &&
      filtroCategoria !== "Todas" &&
      filtroCategoria !== "Ingreso de Dinero"
    ) {
      setTransaccionesRestantes([]);
      setTransaccionesRestantes(transaccionesSinFiltroCat);
      console.log(transaccionesSinFiltroCat);
      let transaccionesFiltradas = transaccionesSinFiltroCat.filter(
        (transaccion) =>
          transaccion.categoria !== "Ingreso de Dinero" &&
          transaccion.categoria !== filtroCategoria
      );
      transaccionesFiltradas = transaccionesFiltradas.map((transaccion) => ({
        ...transaccion,
        categoria: "Otros",
      }));
      setTransaccionesRestantes([...transaccionesFiltradas, ...gastos]);
    } else {
      setTransaccionesRestantes([]);
    }

    const sumaPorCategoria = gastos.reduce((acc, transaccion) => {
      const categoria = transaccion.categoria;
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += transaccion.valor;
      return acc;
    }, {});
    let sumaPorCategoriaOtros = 0;
    if (
      filtroCategoria &&
      filtroCategoria !== "Todas" &&
      filtroCategoria !== "Ingreso de Dinero"
    ) {
      sumaPorCategoriaOtros = transaccionesRestantes.reduce(
        (acc, transaccion) => {
          const categoria = transaccion.categoria;
          if (!acc[categoria]) {
            acc[categoria] = 0;
          }
          acc[categoria] += transaccion.valor;
          return acc;
        },
        {}
      );
    }

    const sumaPorTipoGasto = gastos.reduce((acc, transaccion) => {
      const tipoGasto = transaccion.tipoGasto;
      if (!acc[tipoGasto]) {
        acc[tipoGasto] = 0;
      }
      acc[tipoGasto] += transaccion.valor;
      return acc;
    }, {});

    const sumaPorMoneda = gastos.reduce((acc, transaccion) => {
      const moneda = transaccion.monedaOriginal;
      if (!acc[moneda]) {
        acc[moneda] = [0,0];
      }
      acc[moneda][0] += transaccion.valor;
      acc[moneda][1] += transaccion.montoOriginal;
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

      //para la parte de otros
      if (
        filtroCategoria !== "Todas" &&
        filtroCategoria !== "Ingreso de Dinero"
      ) {
        const gastosPorDiaOtros = transaccionesRestantes.reduce(
          (acc, transaccion) => {
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
          },
          {}
        );
      }

      const daysInMonth = new Date(2024, selectedMonth + 1, 0).getDate();
      newDataLine = Array.from({ length: daysInMonth }, (_, index) => ({
        day: (index + 2).toString(),
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

      //para la parte de otros
      if (
        filtroCategoria !== "Todas" &&
        filtroCategoria !== "Ingreso de Dinero"
      ) {
        const gastosPorMesOtros = transaccionesRestantes.reduce(
          (acc, transaccion) => {
            const mes = new Date(transaccion.fecha).getMonth();
            if (!acc[mes]) {
              acc[mes] = 0;
            }
            acc[mes] += transaccion.valor;
            return acc;
          },
          {}
        );
      }

      newDataLine = allMonths.map((month, index) => ({
        month,
        total: gastosPorMes[index] || 0,
      }));
    }
    if (
      filtroCategoria !== "Todas" &&
      filtroCategoria !== "Ingreso de Dinero"
    ) {
      setData(
        Object.entries(sumaPorCategoriaOtros).map(([categoria, monto]) => ({
          name: categoria,
          value: monto,
        }))
      );
    } else {
      setData(
        Object.entries(sumaPorCategoria).map(([categoria, monto]) => ({
          name: categoria,
          value: monto,
        }))
      );
    }
    setDataPay(
      Object.entries(sumaPorTipoGasto).map(([tipoGasto, monto]) => ({
        name: tipoGasto,
        value: monto,
      }))
    );
    setDataMonedas(
      Object.entries(sumaPorMoneda).map(([moneda, valores]) => ({
        name: moneda,
        value: valores[0],
        montoOriginal: valores[1],
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
      ) : type !== "monedas" ? ( 
        <div className="flex flex-col md:flex-row justify-center items-center w-full">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <ResponsiveContainer width="100%" aspect={1}>
              <PieChart>
                <Pie
                  data={type === "categorias" ? data : dataPay}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
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
            </ResponsiveContainer>
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
                dataPay.map((entry, index) => (
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
                ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center mt-4 md:mt-0">
            <ResponsiveContainer width="100%" aspect={1.5}>
              <BarChart data={dataLine}>
                <XAxis dataKey={filtroMes ? "day" : "month"} stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar type="monotone" dataKey="total" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        ):(
          <div className="flex flex-col md:flex-row justify-center items-center w-full">
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <ResponsiveContainer width="100%" aspect={1}>
                <PieChart>
                  <Pie
                    data={dataMonedas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataMonedas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
                <div className="legend flex flex-col mt-4 text-white">
                  {dataMonedas.map((entry, index) => (
                    <div key={`legend-item-${index}`} className="flex items-center mb-2">
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
                  ))}
                </div>
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, payload: data } = payload[0];

    return (
      <div className="bg-gray-800 text-white p-2 rounded">
        <p className="font-bold text-center">{data.montoOriginal} {name} </p>
        <p>({data.value} ARG) </p>
      </div>
    );
  }

  return null;
};


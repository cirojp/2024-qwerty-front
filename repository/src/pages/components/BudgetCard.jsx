function BudgetCard({
  title,
  icon,
  dateFrom,
  dateTo,
  percentage,
  currentAmount,
  maxAmount,
  residualAmount,
}) {
  return (
    <div className="card shadow-lg rounded-lg bg-[#1E2126] p-4 text-white">
      <div className="flex items-center gap-4 mb-2">
        <img src={icon} alt={title} className="w-10 h-10" />
        <div className="flex-1">
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-sm text-white">{`${dateFrom} - ${dateTo}`}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div
            style={{ width: `${percentage}%` }}
            className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all"
          />
        </div>
        <div className="text-sm font-semibold">{percentage}%</div>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span>0,00 SAR</span>
        <span>Gastado: {currentAmount}</span>
        <span>{maxAmount}</span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm font-semibold text-white">{`Monto restante: ${residualAmount}`}</span>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline btn-info">Edit</button>
          <button className="btn btn-sm btn-outline btn-error">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;

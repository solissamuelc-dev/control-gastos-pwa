import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function CategoryBreakdown({ transactions = [], categories = [] }) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Filtrar solo gastos del mes
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);

  if (totalExpense === 0) return null;

  // Agrupar gastos por categoría
  const grouped = expenses.reduce((acc, t) => {
    const key = t.categoryId;
    acc[key] = (acc[key] || 0) + Number(t.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(grouped)
    .map(([catId, amount]) => {
      const cat = categoryMap.get(Number(catId)) || categoryMap.get(catId);
      return {
        name: cat?.name || 'Otros',
        color: cat?.color || '#94a3b8',
        amount,
        percentage: ((amount / totalExpense) * 100).toFixed(1)
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Distribución de Gastos
      </h3>

      {/* Barra de progreso multicolor */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-900 border border-slate-700/40">
        {sortedCategories.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            title={`${item.name}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Leyenda de categorías principales */}
      <div className="space-y-2 pt-1">
        {sortedCategories.slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">{formatCurrency(item.amount)}</span>
              <span className="text-slate-500 w-10 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
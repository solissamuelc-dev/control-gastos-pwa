import React from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SummaryCards({ transactions = [] }) {
  const totals = transactions.reduce(
    (acc, curr) => {
      if (curr.type === 'income') {
        acc.income += Number(curr.amount);
      } else {
        acc.expense += Number(curr.amount);
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Balance */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Balance Mes</span>
          <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-bold tracking-tight ${balance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Ingresos */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Ingresos</span>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-emerald-400">
          {formatCurrency(totals.income)}
        </p>
      </div>

      {/* Gastos */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Gastos</span>
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-rose-400">
          {formatCurrency(totals.expense)}
        </p>
      </div>
    </div>
  );
}
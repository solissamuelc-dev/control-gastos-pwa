import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { db } from '../db/db';

export default function TransactionList({ transactions = [], categories = [] }) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este movimiento?')) {
      await db.transactions.delete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-dashed border-slate-700/80 rounded-2xl p-8 text-center">
        <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p className="text-sm text-slate-400 font-medium">No hay movimientos registrados este mes.</p>
        <p className="text-xs text-slate-500 mt-1">Usa el botón inferior para ingresar tu primer gasto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const cat = categoryMap.get(Number(tx.categoryId)) || categoryMap.get(tx.categoryId);
        const isIncome = tx.type === 'income';

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl transition-colors hover:border-slate-600/80"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: `${cat?.color || '#64748b'}20`, color: cat?.color || '#94a3b8' }}
              >
                {cat?.name ? cat.name.charAt(0) : '$'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {tx.note || cat?.name || 'Movimiento'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatDate(tx.date)}</span>
                  <span>•</span>
                  <span className="capitalize">{tx.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
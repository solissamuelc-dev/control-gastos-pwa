import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { formatCurrency } from './utils/formatters';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Consulta reactiva a IndexedDB
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-md w-full space-y-6">
        <header className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Control de Gastos</h1>
            <p className="text-xs text-slate-400">Base de datos local IndexedDB conectada</p>
          </div>
        </header>

        <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Categorías inicializadas ({categories ? categories.length : 0})
          </h2>

          <div className="space-y-2">
            {categories ? (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/40 text-sm"
                >
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      cat.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {cat.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Cargando categorías...</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
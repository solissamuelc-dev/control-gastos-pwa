import React from 'react';
import { Wallet, PlusCircle } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-xl space-y-4">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Control de Gastos</h1>
        <p className="text-sm text-slate-400">
          Entorno configurado correctamente con Tailwind y Lucide Icons.
        </p>
        <button className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-semibold rounded-xl flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Nuevo Registro
        </button>
      </div>
    </main>
  );
}
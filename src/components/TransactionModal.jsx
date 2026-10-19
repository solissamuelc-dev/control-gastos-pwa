import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../db/db';

export default function TransactionModal({ isOpen, onClose, categories = [] }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('debit');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanAmount = parseInt(amount, 10);
    if (!cleanAmount || cleanAmount <= 0) return;

    const selectedCat = categoryId || (filteredCategories[0] ? filteredCategories[0].id : null);

    await db.transactions.add({
      amount: cleanAmount,
      type,
      categoryId: selectedCat,
      note: note.trim(),
      paymentMethod,
      date,
      createdAt: Date.now()
    });

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-800 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <h2 className="text-base font-bold text-slate-100">Registrar Movimiento</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Tipo */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/60 p-1 rounded-xl border border-slate-700/40">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategoryId(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ingreso
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Monto */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Monto ($)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-bold text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Medio</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="debit">Débito</option>
                <option value="credit">Crédito</option>
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Descripción / Nota</label>
            <input
              type="text"
              placeholder="Ej. Compra semanal de verduras"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-98 transition-all text-slate-950 font-bold rounded-xl shadow-lg mt-2 text-sm"
          >
            Guardar Transacción
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, ChevronLeft, ChevronRight, PieChart, Download, Upload, Cloud, CloudOff, RefreshCw, LogOut } from 'lucide-react';
import { db } from './db/db';
import { supabase } from './db/supabase';
import { getCurrentMonthKey } from './utils/formatters';
import { exportDatabaseBackup, importDatabaseBackup } from './utils/backup';
import { syncWithCloud } from './utils/sync';
import SummaryCards from './components/SummaryCards';
import CategoryBreakdown from './components/CategoryBreakdown';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef(null);

  // Escuchar sesión activa de Supabase
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleSync(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSync = async (currentUser = user) => {
    if (!currentUser || isSyncing) return;
    setIsSyncing(true);
    await syncWithCloud(currentUser);
    setIsSyncing(false);
  };

const handleLogout = async () => {
    if (!supabase) return;
    if (confirm('¿Cerrar sesión en este dispositivo?')) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const categories = useLiveQuery(() => db.categories.toArray(), []) || [];

  const transactions = useLiveQuery(
    () =>
      db.transactions
        .where('date')
        .between(`${currentMonth}-01`, `${currentMonth}-31`, true, true)
        .reverse()
        .sortBy('date'),
    [currentMonth]
  ) || [];

  const changeMonth = (offset) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${newY}-${newM}`);
  };

  const formatMonthTitle = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (confirm('Importar este respaldo reemplazará los datos actuales. ¿Deseas continuar?')) {
      try {
        await importDatabaseBackup(file);
        alert('Respaldo restaurado con éxito.');
      } catch (err) {
        alert('Error al leer el archivo de respaldo: ' + err.message);
      }
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm tracking-wide">Mis Finanzas</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Estado de sincronización en la nube */}
            {user ? (
              <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/50 rounded-xl p-1">
                <button
                  onClick={() => handleSync()}
                  disabled={isSyncing}
                  title="Sincronizar ahora"
                  className="p-1.5 text-emerald-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  title={`Cerrar sesión (${user.email})`}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Nube</span>
              </button>
            )}

            {/* Respaldo JSON manual */}
            <button
              onClick={exportDatabaseBackup}
              title="Descargar copia de seguridad"
              className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800/80 border border-slate-700/50 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Restaurar copia de seguridad"
              className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800/80 border border-slate-700/50 rounded-xl transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            {/* Selector de Mes */}
            <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/60 rounded-xl px-2 py-1">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:text-emerald-400 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2 capitalize">
                {formatMonthTitle(currentMonth)}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:text-emerald-400 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-xl mx-auto p-4 space-y-4">
        <SummaryCards transactions={transactions} />
        <CategoryBreakdown transactions={transactions} categories={categories} />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Movimientos del Mes
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {transactions.length} registros
            </span>
          </div>

          <TransactionList transactions={transactions} categories={categories} />
        </section>
      </main>

      {/* Botón flotante para nuevo registro */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 md:right-auto md:left-1/2 md:translate-x-[220px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-4 rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center"
        aria-label="Nuevo gasto o ingreso"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Modales */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (user) handleSync();
        }}
        categories={categories}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(loggedUser) => handleSync(loggedUser)}
      />
    </div>
  );
}
import Dexie from 'dexie';

export const db = new Dexie('ExpenseTrackerDB');

// Definición del esquema de la base de datos
db.version(1).stores({
  categories: '++id, name, type',
  transactions: '++id, date, categoryId, amount, paymentMethod, createdAt',
  budgets: '++id, [month+categoryId], month'
});

// Categorías iniciales por defecto al crear la base de datos por primera vez
db.on('populate', () => {
  db.categories.bulkAdd([
    { name: 'Supermercado y Comida', icon: 'ShoppingCart', color: '#10b981', type: 'expense' },
    { name: 'Vivienda y Servicios', icon: 'Home', color: '#3b82f6', type: 'expense' },
    { name: 'Transporte y Bencina', icon: 'Car', color: '#f59e0b', type: 'expense' },
    { name: 'Salud y Farmacia', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
    { name: 'Ocio y Suscripciones', icon: 'Tv', color: '#8b5cf6', type: 'expense' },
    { name: 'Educación y Cursos', icon: 'GraduationCap', color: '#06b6d4', type: 'expense' },
    { name: 'Otros Gastos', icon: 'Tag', color: '#64748b', type: 'expense' },
    { name: 'Sueldo / Honorarios', icon: 'Briefcase', color: '#22c55e', type: 'income' },
    { name: 'Otros Ingresos', icon: 'PlusCircle', color: '#14b8a6', type: 'income' }
  ]);
});
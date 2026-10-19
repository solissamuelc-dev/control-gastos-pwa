import { db } from '../db/db';

// Exportar todos los datos locales a un archivo JSON descargable
export async function exportDatabaseBackup() {
  const categories = await db.categories.toArray();
  const transactions = await db.transactions.toArray();

  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      categories,
      transactions
    }
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `respaldo_gastos_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Importar y restaurar datos desde un archivo JSON
export async function importDatabaseBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.data || !Array.isArray(json.data.transactions)) {
          throw new Error('Formato de archivo inválido.');
        }

        await db.transaction('rw', db.categories, db.transactions, async () => {
          await db.transactions.clear();
          await db.transactions.bulkAdd(json.data.transactions);

          if (json.data.categories && json.data.categories.length > 0) {
            await db.categories.clear();
            await db.categories.bulkAdd(json.data.categories);
          }
        });

        resolve(true);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
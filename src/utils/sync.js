import { db } from '../db/db';
import { supabase } from '../db/supabase';

export async function syncWithCloud(user) {
  if (!supabase) return { success: false, message: 'Supabase no está configurado.' };
  if (!user) return { success: false, message: 'Usuario no autenticado.' };

  try {
    // 1. PUSH: Subir transacciones locales que aún no tienen supabaseId
    const localTransactions = await db.transactions.toArray();
    const pendingToPush = localTransactions.filter((tx) => !tx.supabaseId);

    for (const tx of pendingToPush) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: tx.amount,
          type: tx.type,
          category_id: tx.categoryId ? Number(tx.categoryId) : null,
          note: tx.note || '',
          payment_method: tx.paymentMethod || 'debit',
          date: tx.date,
          created_at: tx.createdAt
        })
        .select()
        .single();

      if (!error && data) {
        await db.transactions.update(tx.id, { supabaseId: data.id });
      }
    }

    // 2. PULL: Consultar registros actualizados en Supabase
    const { data: cloudTransactions, error: pullError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (pullError) throw pullError;

    const cloudMap = new Map((cloudTransactions || []).map((t) => [t.id, t]));
    const currentLocals = await db.transactions.toArray();

    // 2.1 ELIMINAR EN LOCAL: Si tenía supabaseId pero ya no existe en Supabase, se borró en el otro equipo
    for (const localTx of currentLocals) {
      if (localTx.supabaseId && !cloudMap.has(localTx.supabaseId)) {
        await db.transactions.delete(localTx.id);
      }
    }

    // 2.2 INSERTAR EN LOCAL: Registros nuevos creados en el otro equipo
    const localSupabaseIds = new Set(
      currentLocals.filter((t) => t.supabaseId).map((t) => t.supabaseId)
    );

    for (const cloudTx of cloudTransactions) {
      if (!localSupabaseIds.has(cloudTx.id)) {
        await db.transactions.add({
          amount: Number(cloudTx.amount),
          type: cloudTx.type,
          categoryId: cloudTx.category_id,
          note: cloudTx.note,
          paymentMethod: cloudTx.payment_method,
          date: cloudTx.date,
          createdAt: Number(cloudTx.created_at),
          supabaseId: cloudTx.id
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    return { success: false, error: error.message };
  }
}
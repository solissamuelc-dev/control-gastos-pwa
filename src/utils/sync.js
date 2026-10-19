import { db } from '../db/db';
import { supabase } from '../db/supabase';

export async function syncWithCloud(user) {
  if (!supabase) return { success: false, message: 'Supabase no está configurado.' };
  if (!user) return { success: false, message: 'Usuario no autenticado.' };

  try {
    // 1. PUSH: Subir transacciones locales pendientes
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

    // 2. PULL: Descargar transacciones creadas en otros dispositivos
    const { data: cloudTransactions, error: pullError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (pullError) throw pullError;

    if (cloudTransactions && cloudTransactions.length > 0) {
      const currentLocals = await db.transactions.toArray();
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
    }

    return { success: true };
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    return { success: false, error: error.message };
  }
}
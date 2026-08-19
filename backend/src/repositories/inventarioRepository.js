const supabase = require('../config/supabaseClient');

const TABLE = 'inventario';

async function findByProductoId(productoId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('producto_id', productoId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function findBajoStock() {
  const { data, error } = await supabase.rpc('inventario_bajo_stock');

  if (error) throw error;
  return data;
}

async function create({ producto_id, cantidad_disponible, cantidad_reservada, umbral_minimo }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ producto_id, cantidad_disponible, cantidad_reservada, umbral_minimo }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateCantidadDisponible(productoId, nuevaCantidad) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ cantidad_disponible: nuevaCantidad })
    .eq('producto_id', productoId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function remove(productoId) {
  const { error } = await supabase.from(TABLE).delete().eq('producto_id', productoId);
  if (error) throw error;
}

module.exports = {
  findByProductoId,
  findBajoStock,
  create,
  updateCantidadDisponible,
  remove,
};

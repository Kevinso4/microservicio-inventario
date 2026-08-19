const repo = require('../repositories/inventarioRepository');
const ApiError = require('../utils/ApiError');

async function obtenerPorProductoId(productoId) {
  const item = await repo.findByProductoId(productoId);
  if (!item) {
    throw new ApiError(404, `No existe inventario para el producto '${productoId}'`);
  }
  return item;
}

async function obtenerBajoStock() {
  return repo.findBajoStock();
}

async function crear({ producto_id, cantidad_disponible, cantidad_reservada, umbral_minimo }) {
  const existente = await repo.findByProductoId(producto_id);
  if (existente) {
    throw new ApiError(409, `Ya existe inventario para el producto '${producto_id}'`);
  }

  return repo.create({
    producto_id,
    cantidad_disponible: cantidad_disponible ?? 0,
    cantidad_reservada: cantidad_reservada ?? 0,
    umbral_minimo: umbral_minimo ?? 0,
  });
}

async function aumentar(productoId, cantidad) {
  const item = await obtenerPorProductoId(productoId);
  const nuevaCantidad = item.cantidad_disponible + cantidad;
  return repo.updateCantidadDisponible(productoId, nuevaCantidad);
}

async function disminuir(productoId, cantidad) {
  const item = await obtenerPorProductoId(productoId);

  if (cantidad > item.cantidad_disponible) {
    throw new ApiError(
      409,
      `Stock insuficiente para '${productoId}': disponible ${item.cantidad_disponible}, solicitado ${cantidad}`
    );
  }

  const nuevaCantidad = item.cantidad_disponible - cantidad;
  return repo.updateCantidadDisponible(productoId, nuevaCantidad);
}

async function eliminar(productoId) {
  await obtenerPorProductoId(productoId);
  await repo.remove(productoId);
}

module.exports = {
  obtenerPorProductoId,
  obtenerBajoStock,
  crear,
  aumentar,
  disminuir,
  eliminar,
};

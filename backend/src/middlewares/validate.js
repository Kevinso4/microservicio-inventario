const ApiError = require('../utils/ApiError');

function validarProductoId(req, res, next) {
  const { productoId } = req.params;
  if (!productoId || typeof productoId !== 'string' || !productoId.trim()) {
    return next(new ApiError(400, 'El parametro producto_id es obligatorio'));
  }
  next();
}

function validarCantidadBody(req, res, next) {
  const { cantidad } = req.body;

  if (cantidad === undefined || cantidad === null) {
    return next(new ApiError(400, 'El campo cantidad es obligatorio'));
  }
  if (typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
    return next(new ApiError(400, 'El campo cantidad debe ser un numero entero'));
  }
  if (cantidad <= 0) {
    return next(new ApiError(400, 'El campo cantidad debe ser mayor a 0'));
  }
  next();
}

function validarCrearInventario(req, res, next) {
  const { producto_id, cantidad_disponible, cantidad_reservada, umbral_minimo } = req.body;

  if (!producto_id || typeof producto_id !== 'string' || !producto_id.trim()) {
    return next(new ApiError(400, 'El campo producto_id es obligatorio y debe ser texto'));
  }

  const camposNumericos = { cantidad_disponible, cantidad_reservada, umbral_minimo };
  for (const [campo, valor] of Object.entries(camposNumericos)) {
    if (valor === undefined) continue;
    if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0) {
      return next(new ApiError(400, `El campo ${campo} debe ser un numero entero mayor o igual a 0`));
    }
  }

  next();
}

module.exports = { validarProductoId, validarCantidadBody, validarCrearInventario };

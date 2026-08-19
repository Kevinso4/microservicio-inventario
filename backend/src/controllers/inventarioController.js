const service = require('../services/inventarioService');

async function obtener(req, res, next) {
  try {
    const item = await service.obtenerPorProductoId(req.params.productoId);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function bajoStock(req, res, next) {
  try {
    const items = await service.obtenerBajoStock();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const item = await service.crear(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function aumentar(req, res, next) {
  try {
    const item = await service.aumentar(req.params.productoId, req.body.cantidad);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function disminuir(req, res, next) {
  try {
    const item = await service.disminuir(req.params.productoId, req.body.cantidad);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    await service.eliminar(req.params.productoId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { obtener, bajoStock, crear, aumentar, disminuir, eliminar };

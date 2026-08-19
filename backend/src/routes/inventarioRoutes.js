const express = require('express');
const controller = require('../controllers/inventarioController');
const {
  validarProductoId,
  validarCantidadBody,
  validarCrearInventario,
} = require('../middlewares/validate');

const router = express.Router();

// IMPORTANTE: /bajo-stock debe declararse antes de /:productoId para que no sea interpretado como un id
router.get('/inventario/bajo-stock', controller.bajoStock);

router.post('/inventario', validarCrearInventario, controller.crear);

router.get('/inventario/:productoId', validarProductoId, controller.obtener);

router.patch(
  '/inventario/:productoId/aumentar',
  validarProductoId,
  validarCantidadBody,
  controller.aumentar
);

router.patch(
  '/inventario/:productoId/disminuir',
  validarProductoId,
  validarCantidadBody,
  controller.disminuir
);

router.delete('/inventario/:productoId', validarProductoId, controller.eliminar);

module.exports = router;

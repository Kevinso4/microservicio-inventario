const test = require('node:test');
const assert = require('node:assert');
const { validarCantidadBody, validarCrearInventario } = require('../src/middlewares/validate');

function mockNext() {
  const calls = [];
  const next = (err) => calls.push(err);
  return { next, calls };
}

test('validarCantidadBody rechaza cantidad faltante', () => {
  const { next, calls } = mockNext();
  validarCantidadBody({ body: {} }, {}, next);
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].statusCode, 400);
});

test('validarCantidadBody rechaza cantidad no entera', () => {
  const { next, calls } = mockNext();
  validarCantidadBody({ body: { cantidad: 1.5 } }, {}, next);
  assert.strictEqual(calls[0].statusCode, 400);
});

test('validarCantidadBody rechaza cantidad <= 0', () => {
  const { next, calls } = mockNext();
  validarCantidadBody({ body: { cantidad: 0 } }, {}, next);
  assert.strictEqual(calls[0].statusCode, 400);
});

test('validarCantidadBody acepta cantidad entera positiva', () => {
  const { next, calls } = mockNext();
  validarCantidadBody({ body: { cantidad: 5 } }, {}, next);
  assert.strictEqual(calls[0], undefined);
});

test('validarCrearInventario rechaza producto_id faltante', () => {
  const { next, calls } = mockNext();
  validarCrearInventario({ body: { cantidad_disponible: 10 } }, {}, next);
  assert.strictEqual(calls[0].statusCode, 400);
});

test('validarCrearInventario acepta payload valido', () => {
  const { next, calls } = mockNext();
  validarCrearInventario(
    { body: { producto_id: 'PROD-010', cantidad_disponible: 10, umbral_minimo: 2 } },
    {},
    next
  );
  assert.strictEqual(calls[0], undefined);
});

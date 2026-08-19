import { useState } from 'react';
import {
  obtenerInventario,
  obtenerBajoStock,
  crearInventario,
  aumentarInventario,
  disminuirInventario,
  eliminarInventario,
} from './api';
import './App.css';

function ResultadoJSON({ resultado }) {
  if (!resultado) return null;
  return (
    <pre className={`resultado ${resultado.ok ? 'ok' : 'error'}`}>
      {resultado.ok ? 'OK' : 'ERROR'} {resultado.status ? `(${resultado.status})` : ''}
      {'\n'}
      {JSON.stringify(resultado.data, null, 2)}
    </pre>
  );
}

function useAccion() {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function ejecutar(fn) {
    setCargando(true);
    setResultado(null);
    try {
      const data = await fn();
      setResultado({ ok: true, data });
    } catch (err) {
      setResultado({ ok: false, data: { error: err.message } });
    } finally {
      setCargando(false);
    }
  }

  return { resultado, cargando, ejecutar };
}

function ConsultarProducto() {
  const [productoId, setProductoId] = useState('PROD-001');
  const { resultado, cargando, ejecutar } = useAccion();

  return (
    <section className="card">
      <h2>GET /inventario/{'{producto_id}'}</h2>
      <div className="fila">
        <input value={productoId} onChange={(e) => setProductoId(e.target.value)} placeholder="producto_id" />
        <button disabled={cargando} onClick={() => ejecutar(() => obtenerInventario(productoId))}>
          Consultar
        </button>
      </div>
      <ResultadoJSON resultado={resultado} />
    </section>
  );
}

function BajoStock() {
  const { resultado, cargando, ejecutar } = useAccion();

  return (
    <section className="card">
      <h2>GET /inventario/bajo-stock</h2>
      <div className="fila">
        <button disabled={cargando} onClick={() => ejecutar(() => obtenerBajoStock())}>
          Listar bajo stock
        </button>
      </div>
      <ResultadoJSON resultado={resultado} />
    </section>
  );
}

function CrearProducto() {
  const [form, setForm] = useState({
    producto_id: '',
    cantidad_disponible: 0,
    cantidad_reservada: 0,
    umbral_minimo: 0,
  });
  const { resultado, cargando, ejecutar } = useAccion();

  function update(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  return (
    <section className="card">
      <h2>POST /inventario</h2>
      <div className="grid">
        <input
          placeholder="producto_id"
          value={form.producto_id}
          onChange={(e) => update('producto_id', e.target.value)}
        />
        <input
          type="number"
          placeholder="cantidad_disponible"
          value={form.cantidad_disponible}
          onChange={(e) => update('cantidad_disponible', Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="cantidad_reservada"
          value={form.cantidad_reservada}
          onChange={(e) => update('cantidad_reservada', Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="umbral_minimo"
          value={form.umbral_minimo}
          onChange={(e) => update('umbral_minimo', Number(e.target.value))}
        />
      </div>
      <div className="fila">
        <button disabled={cargando} onClick={() => ejecutar(() => crearInventario(form))}>
          Crear
        </button>
      </div>
      <ResultadoJSON resultado={resultado} />
    </section>
  );
}

function AjustarCantidad() {
  const [productoId, setProductoId] = useState('PROD-001');
  const [cantidad, setCantidad] = useState(1);
  const { resultado, cargando, ejecutar } = useAccion();

  return (
    <section className="card">
      <h2>PATCH /inventario/{'{producto_id}'}/aumentar | disminuir</h2>
      <div className="fila">
        <input value={productoId} onChange={(e) => setProductoId(e.target.value)} placeholder="producto_id" />
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          placeholder="cantidad"
        />
      </div>
      <div className="fila">
        <button disabled={cargando} onClick={() => ejecutar(() => aumentarInventario(productoId, cantidad))}>
          Aumentar
        </button>
        <button disabled={cargando} onClick={() => ejecutar(() => disminuirInventario(productoId, cantidad))}>
          Disminuir
        </button>
        <button
          className="peligro"
          disabled={cargando}
          onClick={() => ejecutar(() => eliminarInventario(productoId))}
        >
          Eliminar
        </button>
      </div>
      <ResultadoJSON resultado={resultado} />
    </section>
  );
}

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Microservicio de Inventario</h1>
        <p>Cliente de prueba (React) para la API REST del microservicio.</p>
      </header>
      <main>
        <ConsultarProducto />
        <AjustarCantidad />
        <CrearProducto />
        <BajoStock />
      </main>
    </div>
  );
}
